import { InputType, Field } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';

@InputType()
export class TripInput {
  @Field() @IsDateString() departureTime: string;
  @Field() @IsDateString() arrivalTime: string;
}
