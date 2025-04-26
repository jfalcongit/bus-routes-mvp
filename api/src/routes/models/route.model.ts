import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StopOrder } from './stop-order.model';
import { Trip } from './trip.model';

@ObjectType()
export class Route {
  @Field() id: string;
  @Field(() => Int) fare: number;
  @Field(() => Int) capacity: number;
  @Field(() => [StopOrder]) stops: StopOrder[];
  @Field(() => [Trip]) trips: Trip[];
}
