import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StopOrder } from './stop-order.model';
import { Trip } from './trip.model';

/**
 * Modelo de Ruta
 *
 * Representa una ruta de autobús completa con sus paradas ordenadas,
 * viajes programados, tarifa y capacidad de pasajeros.
 */
@ObjectType()
export class Route {
  /** Identificador único de la ruta */
  @Field() id: string;

  /** Tarifa de la ruta en centavos/céntimos */
  @Field(() => Int) fare: number;

  /** Capacidad máxima de pasajeros del vehículo */
  @Field(() => Int) capacity: number;

  /** Lista de paradas en esta ruta con su orden específico */
  @Field(() => [StopOrder]) stops: StopOrder[];

  /** Viajes programados en esta ruta */
  @Field(() => [Trip]) trips: Trip[];
}
