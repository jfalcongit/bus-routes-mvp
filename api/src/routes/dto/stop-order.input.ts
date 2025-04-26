import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsString, IsNumber, Min, Max } from 'class-validator';

/**
 * Clase que define los datos de entrada para un punto de parada en una ruta
 * Se utiliza como parámetro en las mutaciones de GraphQL relacionadas con rutas y paradas
 */
@InputType()
export class StopOrderInput {
  /**
   * Orden numérico de la parada dentro de la ruta
   */
  @Field(() => Int)
  @IsInt()
  @Min(0, { message: 'El orden de la parada debe ser un número positivo' })
  stopOrder: number;

  /**
   * Nombre o descripción de la parada
   */
  @Field()
  @IsString()
  name: string;

  /**
   * Latitud geográfica de la parada
   */
  @Field(() => Float)
  @IsNumber()
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  lat: number;

  /**
   * Longitud geográfica de la parada
   */
  @Field(() => Float)
  @IsNumber()
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  lng: number;
}
