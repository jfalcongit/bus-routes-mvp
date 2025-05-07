/**
 * Módulo de Mapas
 *
 * Este módulo se encarga de la funcionalidad relacionada con mapas en la aplicación.
 * Integra servicios para interactuar con la API de Google Maps y planificación de rutas
 * utilizando modelos de lenguaje (LLM).
 *
 * Importa:
 * - HttpModule: Para realizar peticiones HTTP
 *
 * Proveedores:
 * - MapsService: Servicio principal para operaciones de mapas
 * - MapsResolver: Resuelve consultas GraphQL relacionadas con mapas
 * - GoogleMapsClientService: Cliente para la API de Google Maps
 * - LlmRoutePlannerService: Servicio de planificación de rutas con LLM
 */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MapsService } from './maps.service';
import { MapsResolver } from './maps.resolver';
import { GoogleMapsClientService } from './google-maps-client.service';
import { LlmRoutePlannerService } from './llm-route-planner.service';

@Module({
  imports: [HttpModule],
  providers: [
    MapsService,
    MapsResolver,
    GoogleMapsClientService,
    LlmRoutePlannerService,
  ],
})
export class MapsModule {}
