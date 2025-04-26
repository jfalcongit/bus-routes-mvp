import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StopOrderInput } from './stop-order.input';
import { TripInput } from './trip.input';

@InputType()
export class UpdateRouteInput {
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() fare?: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @Field(() => [StopOrderInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StopOrderInput)
  stops?: StopOrderInput[];

  @Field(() => [TripInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TripInput)
  trips?: TripInput[];
}
