import { InputType, Field } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';

/**
 * Clase que define los datos de entrada para un viaje
 * Se utiliza como parámetro en las mutaciones de GraphQL
 */
@InputType()
export class TripInput {
  /**
   * Hora de salida del viaje en formato ISO 8601
   */
  @Field() @IsDateString() departureTime: string;

  /**
   * Hora de llegada del viaje en formato ISO 8601
   */
  @Field() @IsDateString() arrivalTime: string;
}
