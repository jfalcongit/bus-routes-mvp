import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StopOrderInput } from './stop-order.input';
import { TripInput } from './trip.input';

/**
 * Clase que define los datos de entrada para crear una nueva ruta de transporte
 * Se utiliza como parámetro en las mutaciones de GraphQL para crear rutas
 */
@InputType()
export class CreateRouteInput {
  /**
   * Identificador único de la ruta
   */
  @Field() @IsString() id: string;

  /**
   * Tarifa de la ruta en centavos o unidad monetaria mínima
   */
  @Field(() => Int) @IsInt() @Min(0) fare: number;

  /**
   * Capacidad máxima de pasajeros del vehículo
   */
  @Field(() => Int) @IsInt() @Min(1) capacity: number;

  /**
   * Lista de paradas ordenadas que componen la ruta
   */
  @Field(() => [StopOrderInput])
  @ValidateNested({ each: true })
  @Type(() => StopOrderInput)
  stops: StopOrderInput[];

  /**
   * Lista opcional de viajes programados para esta ruta
   */
  @Field(() => [TripInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => TripInput)
  trips?: TripInput[];
}
