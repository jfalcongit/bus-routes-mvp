import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Trip {
  @Field() departureTime: Date;
  @Field() arrivalTime: Date;
}
