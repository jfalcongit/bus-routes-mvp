import { InputType, Field, ObjectType, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

// Interfaz base para todos los objetos de tipo parada (Stop)
export interface BaseStop {
  name: string; // Nombre de la parada
  lat: number; // Latitud
  lng: number; // Longitud
  placeId: string; // Identificador (API de Google Places)
}

// Representa una parada potencial encontrada a través de la API de Places
export interface StopCandidate extends BaseStop {
  types: string[]; // Tipos de lugar (ej. parada_de_autobús, estación)
  rating?: number; // Calificación del lugar (opcional)
  vicinity?: string; // Vecindario o área cercana (opcional)
}

// Estructura de la respuesta de la API de Google Directions
export interface GoogleDirectionsResponse {
  routes: Array<{
    overview_polyline: {
      points: string; // Polilínea codificada de la ruta
    };
    legs: Array<{
      start_location: { lat: number; lng: number }; // Ubicación de inicio
      end_location: { lat: number; lng: number }; // Ubicación final
      steps: Array<any>; // Pasos de la ruta
      distance: { value: number; text: string }; // Distancia total
      duration: { value: number; text: string }; // Duración estimada
    }>;
    waypoint_order?: number[]; // Orden de puntos intermedios
  }>;
  status: string; // Estado de la respuesta
  error_message?: string; // Mensaje de error (si existe)
}

// Respuesta del modelo de lenguaje con paradas procesadas
export interface LlmResponse {
  stops: BaseStop[]; // Lista de paradas identificadas
}

/**
 * Representación de una parada en la ruta
 * Sirve como tipo de objeto y tipo de entrada para GraphQL
 */
@ObjectType()
@InputType('StopInput')
export class Stop implements BaseStop {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @Field(() => Float)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  placeId: string;
}
