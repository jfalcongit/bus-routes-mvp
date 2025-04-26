import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './models/route.model';
import { StopOrder } from './models/stop-order.model';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(private readonly routesService: RoutesService) {}

  // List with pagination, filtering, sorting
  @Query(() => [Route], { name: 'routes' })
  routes(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 20 }) perPage: number,
    @Args('origin', { type: () => String, nullable: true }) origin?: string,
    @Args('destination', { type: () => String, nullable: true })
    destination?: string,
    @Args('sortBy', { type: () => String, nullable: true })
    sortBy?: 'origin' | 'destination',
    @Args('sortOrder', { type: () => String, nullable: true })
    sortOrder?: 'asc' | 'desc',
  ) {
    return this.routesService.findAll(
      page,
      perPage,
      origin,
      destination,
      sortBy,
      sortOrder,
    );
  }

  // Get one by ID
  @Query(() => Route, { name: 'route', nullable: true })
  route(@Args('id') id: string) {
    return this.routesService.findOne(id);
  }

  // Create—including nested stops & trips
  @Mutation(() => Route, { name: 'createRoute' })
  createRoute(@Args('data') data: CreateRouteInput) {
    return this.routesService.create(data);
  }

  // Update (replace nested children if provided)
  @Mutation(() => Route, { name: 'updateRoute' })
  updateRoute(@Args('id') id: string, @Args('data') data: UpdateRouteInput) {
    return this.routesService.update(id, data);
  }

  // Delete
  @Mutation(() => Route, { name: 'removeRoute' })
  removeRoute(@Args('id') id: string) {
    return this.routesService.remove(id);
  }

  // Resolve nested fields
  @ResolveField(() => [StopOrder])
  stops(@Parent() route: any): StopOrder[] {
    return route.routeStops.map((rs) => ({
      stopOrder: rs.stopOrder,
      name: rs.stop.name,
      lat: rs.stop.latitude,
      lng: rs.stop.longitude,
    }));
  }
}
