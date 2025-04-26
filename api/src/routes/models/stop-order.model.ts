import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

/**
 * Modelo de Orden de Parada
 *
 * Representa una parada específica de autobús junto con su orden secuencial
 * en una ruta determinada. Incluye datos de posición geográfica y nombre.
 */
@ObjectType()
export class StopOrder {
  /** Número de orden secuencial de la parada en la ruta */
  @Field(() => Int) stopOrder: number;

  /** Nombre o identificador de la parada */
  @Field() name: string;

  /** Coordenada de latitud de la ubicación de la parada */
  @Field(() => Float) lat: number;

  /** Coordenada de longitud de la ubicación de la parada */
  @Field(() => Float) lng: number;
}
