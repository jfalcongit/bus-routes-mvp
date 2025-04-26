import { ObjectType, Field } from '@nestjs/graphql';

/**
 * Modelo de Viaje
 *
 * Representa un viaje programado en una ruta específica con sus respectivos
 * horarios de salida y llegada.
 */
@ObjectType()
export class Trip {
  /** Hora y fecha de salida del viaje */
  @Field() departureTime: Date;

  /** Hora y fecha de llegada estimada del viaje */
  @Field() arrivalTime: Date;
}
