import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class StopOrder {
  @Field(() => Int) stopOrder: number;
  @Field() name: string;
  @Field(() => Float) lat: number;
  @Field(() => Float) lng: number;
}
