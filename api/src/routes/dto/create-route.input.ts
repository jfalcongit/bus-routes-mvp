import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StopOrderInput } from './stop-order.input';
import { TripInput } from './trip.input';

@InputType()
export class CreateRouteInput {
  @Field() @IsString() id: string;
  @Field(() => Int) @IsInt() fare: number;
  @Field(() => Int) @IsInt() capacity: number;

  @Field(() => [StopOrderInput])
  @ValidateNested({ each: true })
  @Type(() => StopOrderInput)
  stops: StopOrderInput[];

  @Field(() => [TripInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => TripInput)
  trips?: TripInput[];
}
