// filepath: src/maps/maps.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { decode } from '@googlemaps/polyline-codec';
import { StopCandidate, BaseStop } from './dto/maps.dto';
import { haversine, samplePointsAlongPolyline } from './utils/maps.utils';
import { GoogleMapsClientService } from './google-maps-client.service';
import { LlmRoutePlannerService } from './llm-route-planner.service';

/**
 * Servicio MapsService
 *
 * Este servicio utiliza Google Maps API y un planificador de rutas basado en IA (LLM)
 * para generar rutas con paradas intermedias optimizadas entre un origen y un destino.
 */
@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);

  // Constantes de configuración
  private readonly MIN_SEPARATION_METERS = 500; // Distancia mínima entre paradas
  private readonly TARGET_CANDIDATE_SAMPLE_DISTANCE_METERS = 1000; // Intervalo de muestreo

  constructor(
    private readonly googleMapsClient: GoogleMapsClientService,
    private readonly llmRoutePlanner: LlmRoutePlannerService,
  ) {}

  /**
   * Decodifica el polyline de una ruta entre origen y destino.
   * @param origin Origen de la ruta.
   * @param dest Destino de la ruta.
   * @returns Lista de puntos decodificados (latitud y longitud).
   */
  private async _getDecodedPolyline(
    origin: BaseStop,
    dest: BaseStop,
  ): Promise<{ lat: number; lng: number }[]> {
    this.logger.log(
      '[MapsService] Fetching initial route and decoding polyline...',
    );
    const initialRouteData = await this.googleMapsClient.getRoute(origin, dest);
    const encodedPolyline =
      initialRouteData.routes[0]?.overview_polyline?.points;
    if (!encodedPolyline) {
      this.logger.error(
        '[MapsService] CRITICAL: Could not retrieve route overview_polyline from Directions API.',
      );
      throw new Error(
        'Failed to get route polyline. Cannot generate intermediate stops.',
      );
    }
    this.logger.log(
      `[MapsService] Initial route polyline received (${encodedPolyline.length} chars). Decoding...`,
    );
    let decodedPath: { lat: number; lng: number }[] = [];
    try {
      decodedPath = decode(encodedPolyline, 5).map((p) => ({
        lat: p[0],
        lng: p[1],
      }));
      this.logger.log(
        `[MapsService] Polyline decoded into ${decodedPath.length} points.`,
      );
    } catch (decodeError) {
      this.logger.error(
        `[MapsService] CRITICAL: Failed to decode polyline: ${decodeError.message}`,
        decodeError.stack,
      );
      throw new Error('Failed to decode route polyline.');
    }
    if (decodedPath.length === 0) {
      this.logger.error(
        '[MapsService] CRITICAL: Decoded polyline has 0 points.',
      );
      throw new Error('Decoded route polyline is empty.');
    }
    this.logger.log('[MapsService] Initial route and polyline processed.');
    return decodedPath;
  }

  /**
   * Muestra puntos a lo largo de un polyline para búsquedas cercanas.
   * @param decodedPath Polyline decodificado.
   * @param origin Origen de la ruta.
   * @returns Lista de puntos únicos para búsqueda.
   */
  private _sampleSearchPoints(
    decodedPath: { lat: number; lng: number }[],
    origin: BaseStop,
  ): { lat: number; lng: number }[] {
    this.logger.log(
      `[MapsService] Sampling points along polyline (Interval: ${this.TARGET_CANDIDATE_SAMPLE_DISTANCE_METERS}m)...`,
    );
    const sampledPoints = samplePointsAlongPolyline(
      decodedPath,
      this.TARGET_CANDIDATE_SAMPLE_DISTANCE_METERS,
    );
    const searchPoints = [
      { lat: origin.lat, lng: origin.lng },
      ...sampledPoints,
    ];
    const uniqueSearchPoints = Array.from(
      new Map(
        searchPoints.map((p) => [`${p.lat.toFixed(5)},${p.lng.toFixed(5)}`, p]),
      ).values(),
    );
    this.logger.log(
      `[MapsService] Generated ${uniqueSearchPoints.length} unique points for nearby searches.`,
    );
    return uniqueSearchPoints;
  }

  /**
   * Recolecta y filtra candidatos cercanos a los puntos de búsqueda.
   * @param searchPoints Puntos de búsqueda.
   * @param origin Origen de la ruta.
   * @param dest Destino de la ruta.
   * @returns Lista de candidatos filtrados.
   */
  private async _gatherAndFilterCandidates(
    searchPoints: { lat: number; lng: number }[],
    origin: BaseStop,
    dest: BaseStop,
  ): Promise<StopCandidate[]> {
    this.logger.log(`[MapsService] Gathering stop candidates...`);
    const seenPlaceIds = new Set<string>([origin.placeId, dest.placeId]);
    const allCandidates: StopCandidate[] = [];

    const candidatePromises = searchPoints.map((point, index) =>
      this.googleMapsClient.findNearbyCandidates(point).then((results) => {
        this.logger.debug(
          `[MapsService] Search point ${index + 1}/${searchPoints.length} (${point.lat.toFixed(4)},${point.lng.toFixed(4)}) yielded ${results.length} raw candidates.`,
        );
        return results;
      }),
    );
    const resultsArrays = await Promise.all(candidatePromises);

    resultsArrays.flat().forEach((candidate) => {
      if (!seenPlaceIds.has(candidate.placeId)) {
        const distFromOrigin = haversine(
          { lat: origin.lat, lng: origin.lng },
          { lat: candidate.lat, lng: candidate.lng },
        );
        const distFromDest = haversine(
          { lat: dest.lat, lng: dest.lng },
          { lat: candidate.lat, lng: candidate.lng },
        );

        if (
          distFromOrigin > this.MIN_SEPARATION_METERS &&
          distFromDest > this.MIN_SEPARATION_METERS
        ) {
          allCandidates.push(candidate);
          seenPlaceIds.add(candidate.placeId);
        } else {
          this.logger.debug(
            `[MapsService] Pre-filtering candidate "${candidate.name}" (PlaceID: ${candidate.placeId}) - too close to Origin (${distFromOrigin.toFixed(0)}m) or Destination (${distFromDest.toFixed(0)}m).`,
          );
        }
      }
    });

    this.logger.log(
      `[MapsService] Collected ${allCandidates.length} unique, pre-filtered candidates.`,
    );
    return allCandidates;
  }

  /**
   * Ordena las paradas seleccionadas por el LLM usando Google Maps Directions API.
   * @param llmPicks Paradas seleccionadas por el LLM.
   * @param origin Origen de la ruta.
   * @param dest Destino de la ruta.
   * @returns Lista de paradas ordenadas.
   */
  private async _orderLlmPicks(
    llmPicks: BaseStop[],
    origin: BaseStop,
    dest: BaseStop,
  ): Promise<BaseStop[]> {
    this.logger.log('[MapsService] Ordering the selected stops...');
    let orderedWaypoints: BaseStop[] = [];

    if (llmPicks.length > 0) {
      const waypointsString = llmPicks
        .map((p) => `place_id:${p.placeId}`)
        .join('|');
      this.logger.log(
        `[MapsService] Requesting optimized route with ${llmPicks.length} waypoints...`,
      );

      try {
        const directionsWithWaypoints = await this.googleMapsClient.getRoute(
          origin,
          dest,
          waypointsString,
        );
        const waypointOrder = directionsWithWaypoints.routes[0]?.waypoint_order;

        if (waypointOrder && waypointOrder.length === llmPicks.length) {
          orderedWaypoints = waypointOrder.map((index) => llmPicks[index]);
          this.logger.log(
            `[MapsService] Waypoints successfully ordered by Directions API: [${orderedWaypoints.map((wp) => wp.name).join(' -> ')}]`,
          );
        } else {
          this.logger.warn(
            `[MapsService] Could not get valid waypoint order from Directions API (Order: ${waypointOrder}). Using original LLM order as fallback.`,
          );
          orderedWaypoints = llmPicks; // Fallback
        }
      } catch (error) {
        this.logger.error(
          `[MapsService] Error getting optimized route with waypoints: ${error.message}. Using original LLM order as fallback.`,
          error.stack,
        );
        orderedWaypoints = llmPicks; // Fallback
      }
    } else {
      this.logger.log('[MapsService] No LLM stops to order.');
    }
    this.logger.log('[MapsService] Stop ordering complete.');
    return orderedWaypoints;
  }

  /**
   * Filtra paradas ordenadas según la distancia mínima de separación.
   * @param stopsToFilter Paradas a filtrar.
   * @param origin Origen de la ruta.
   * @param dest Destino de la ruta.
   * @returns Lista de paradas filtradas.
   */
  private _filterStopsBySeparation(
    stopsToFilter: BaseStop[],
    origin: BaseStop,
    dest: BaseStop,
  ): BaseStop[] {
    this.logger.log(
      `[MapsService] Filtering ordered stops by minimum separation distance (${this.MIN_SEPARATION_METERS}m)...`,
    );
    const finalIntermediateStops: BaseStop[] = [];
    if (stopsToFilter.length > 0) {
      let lastKeptStopCoords = { lat: origin.lat, lng: origin.lng };

      stopsToFilter.forEach((stop) => {
        const currentStopCoords = { lat: stop.lat, lng: stop.lng };
        const distFromLastKept = haversine(
          lastKeptStopCoords,
          currentStopCoords,
        );
        const distFromDest = haversine(currentStopCoords, {
          lat: dest.lat,
          lng: dest.lng,
        });

        if (
          distFromLastKept >= this.MIN_SEPARATION_METERS &&
          distFromDest >= this.MIN_SEPARATION_METERS
        ) {
          finalIntermediateStops.push(stop);
          lastKeptStopCoords = currentStopCoords;
          this.logger.debug(
            `[MapsService] Keeping stop "${stop.name}" (Dist from last kept: ${distFromLastKept.toFixed(0)}m, Dist to dest: ${distFromDest.toFixed(0)}m).`,
          );
        } else {
          this.logger.log(
            `[MapsService] Filtering out stop "${stop.name}" due to proximity (Dist from last kept: ${distFromLastKept.toFixed(0)}m < ${this.MIN_SEPARATION_METERS}m OR Dist to dest: ${distFromDest.toFixed(0)}m < ${this.MIN_SEPARATION_METERS}m).`,
          );
        }
      });
      this.logger.log(
        `[MapsService] Kept ${finalIntermediateStops.length} intermediate stops after distance filtering.`,
      );
    } else {
      this.logger.log('[MapsService] No ordered waypoints to filter.');
    }
    this.logger.log('[MapsService] Distance filtering complete.');
    return finalIntermediateStops;
  }

  /**
   * Genera una lista de paradas intermedias optimizadas entre un origen y un destino.
   * @param originInput Origen de la ruta.
   * @param destinationInput Destino de la ruta.
   * @returns Lista final de paradas (incluyendo origen y destino).
   */
  async generateRouteStopsWithAI(
    origin: BaseStop,
    dest: BaseStop,
  ): Promise<BaseStop[]> {
    this.logger.log(
      `------------------------------------------------------------`,
    );
    this.logger.log(`[MapsService] Starting route stops generation.`);
    this.logger.log(
      `[MapsService] Input: Origin='${origin.name}', Dest='${dest.name}'`,
    );
    this.logger.log(
      `------------------------------------------------------------`,
    );

    const decodedPath = await this._getDecodedPolyline(origin, dest);

    const uniqueSearchPoints = this._sampleSearchPoints(decodedPath, origin);

    const allCandidates = await this._gatherAndFilterCandidates(
      uniqueSearchPoints,
      origin,
      dest,
    );

    this.logger.log('[MapsService] Requesting LLM to select stops...');
    const llmPicks: BaseStop[] = await this.llmRoutePlanner.selectStopsViaLlm(
      origin,
      dest,
      allCandidates,
    );
    this.logger.log(
      `[MapsService] LLM selection process complete. Received ${llmPicks.length} picks.`,
    );

    const orderedWaypoints = await this._orderLlmPicks(llmPicks, origin, dest);

    const finalIntermediateStops = this._filterStopsBySeparation(
      orderedWaypoints,
      origin,
      dest,
    );

    this.logger.log('[MapsService] Building final stop list...');
    const finalStops: BaseStop[] = [
      {
        name: origin.name,
        lat: origin.lat,
        lng: origin.lng,
        placeId: origin.placeId,
      },
      ...finalIntermediateStops.map((s) => ({
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        placeId: s.placeId,
      })),
      {
        name: dest.name,
        lat: dest.lat,
        lng: dest.lng,
        placeId: dest.placeId,
      },
    ];

    this.logger.log(
      `[MapsService] Final stop list created with ${finalStops.length} total stops.`,
    );
    finalStops.forEach((s, i) =>
      this.logger.log(
        `  - Order ${i + 1}: ${s.name} (${s.lat.toFixed(6)}, ${s.lng.toFixed(6)})`,
      ),
    );
    this.logger.log(
      `------------------------------------------------------------`,
    );
    this.logger.log(`[MapsService] Route stops generation complete.`);
    this.logger.log(
      `------------------------------------------------------------`,
    );
    return finalStops;
  }
}
