import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsString, IsNumber } from 'class-validator';

@InputType()
export class StopOrderInput {
  @Field(() => Int) @IsInt() stopOrder: number;
  @Field() @IsString() name: string;
  @Field(() => Float) @IsNumber() lat: number;
  @Field(() => Float) @IsNumber() lng: number;
}
