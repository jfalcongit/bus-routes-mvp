import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StopOrderInput } from './stop-order.input';
import { TripInput } from './trip.input';

/**
 * DTO para actualizar una ruta de autobús
 *
 * Esta clase define la estructura de datos necesaria para actualizar
 * información parcial de una ruta existente. Todos los campos son opcionales
 * ya que se trata de una operación de actualización.
 */
@InputType()
export class UpdateRouteInput {
  /** Tarifa actualizada de la ruta en centavos/céntimos */
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() fare?: number;

  /** Capacidad máxima de pasajeros del vehículo */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  capacity?: number;

  /** Lista actualizada de paradas en esta ruta con su orden específico */
  @Field(() => [StopOrderInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StopOrderInput)
  stops?: StopOrderInput[];

  /** Viajes programados asociados a esta ruta */
  @Field(() => [TripInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TripInput)
  trips?: TripInput[];
}
