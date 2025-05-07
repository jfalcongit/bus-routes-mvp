import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  BaseStop,
  GoogleDirectionsResponse,
  StopCandidate,
} from './dto/maps.dto';

// Servicio para interactuar con la API de Google Maps
// Especializado en búsqueda de lugares y cálculo de rutas en Venezuela
@Injectable()
export class GoogleMapsClientService {
  private readonly googleMapsApiKey: string;
  private readonly COUNTRY_BIAS = 'VE'; // Código de país para priorizar búsquedas en Venezuela
  // Palabras clave para búsqueda de lugares cercanos - Términos relevantes para Venezuela
  private readonly CANDIDATE_KEYWORDS =
    'bus stop|parada|station|terminal|landmark|park|plaza|shopping|market|centro comercial|avenida principal|calle principal';
  private readonly NEARBY_SEARCH_RADIUS_METERS = 750; // Radio de búsqueda en metros alrededor de puntos de muestra

  constructor(private readonly http: HttpService) {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error(
        'Server Configuration Error: GOOGLE_MAPS_API_KEY missing',
      );
    }
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Obtiene indicaciones de ruta desde la API de Google Directions.
   * @param origin - El punto de inicio (BaseStop).
   * @param dest - El punto de destino (BaseStop).
   * @param waypoints - Puntos intermedios opcionales, formato "place_id:XYZ|place_id:ABC".
   * @returns Promesa que resuelve al objeto GoogleDirectionsResponse.
   */
  async getRoute(
    origin: BaseStop,
    dest: BaseStop,
    waypoints: string = '',
  ): Promise<GoogleDirectionsResponse> {
    const waypointCount = waypoints ? waypoints.split('|').length : 0;

    const originParam = `place_id:${origin.placeId}`;
    const destinationParam = `place_id:${dest.placeId}`;

    const directionsUrl = new URL(
      `https://maps.googleapis.com/maps/api/directions/json`,
    );
    directionsUrl.searchParams.append('origin', originParam);
    directionsUrl.searchParams.append('destination', destinationParam);
    directionsUrl.searchParams.append('key', this.googleMapsApiKey);
    directionsUrl.searchParams.append('region', this.COUNTRY_BIAS);

    if (waypoints) {
      directionsUrl.searchParams.append(
        'waypoints',
        `optimize:true|${waypoints}`,
      );
    }

    try {
      const response = await firstValueFrom(
        this.http.get<GoogleDirectionsResponse>(directionsUrl.toString()),
      );

      if (response.data.status !== 'OK' || !response.data.routes?.length) {
        const message = `Directions API error: ${response.data.status}. No route found. ${response.data.error_message || ''}`;
        throw new Error(message);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error_message
        ? `Google Directions API Error: ${error.response.data.error_message}`
        : `Failed to get route. Reason: ${error.message}`;
      throw new Error(message);
    }
  }

  /**
   * Encuentra lugares candidatos cerca de una ubicación usando Google Places Nearby Search.
   * @param location - Punto central {lat, lng} para la búsqueda.
   * @returns Promesa que resuelve a un array de objetos StopCandidate.
   */
  async findNearbyCandidates(location: {
    lat: number;
    lng: number;
  }): Promise<StopCandidate[]> {
    const nearbySearchUrl = new URL(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
    );
    nearbySearchUrl.searchParams.append(
      'location',
      `${location.lat},${location.lng}`,
    );
    nearbySearchUrl.searchParams.append(
      'radius',
      this.NEARBY_SEARCH_RADIUS_METERS.toString(),
    );
    nearbySearchUrl.searchParams.append('keyword', this.CANDIDATE_KEYWORDS);
    nearbySearchUrl.searchParams.append('key', this.googleMapsApiKey);

    try {
      const response = await firstValueFrom(
        this.http.get<{
          results: any[];
          status: string;
          error_message?: string;
        }>(nearbySearchUrl.toString()),
      );

      if (response.data.status === 'OK') {
        return response.data.results.map((r: any) => ({
          name: r.name,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          types: r.types || [],
          rating: r.rating,
          placeId: r.place_id,
          vicinity: r.vicinity,
        }));
      } else if (response.data.status === 'ZERO_RESULTS') {
        return [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
}
