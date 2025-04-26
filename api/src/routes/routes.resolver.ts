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

/**
 * Interfaz que define la estructura de una ruta con sus paradas
 */
interface RouteWithStops {
  routeStops: Array<{
    stopOrder: number;
    stop: {
      name: string;
      latitude: number;
      longitude: number;
    };
  }>;
}

/**
 * Resolvedor GraphQL para gestionar rutas de autobuses.
 * Proporciona operaciones CRUD y resolución de campos anidados.
 */
@Resolver(() => Route)
export class RoutesResolver {
  constructor(private readonly routesService: RoutesService) {}

  /**
   * Consulta para obtener una lista de rutas con opciones de paginación, filtrado y ordenamiento.
   * @param page Número de página para paginación
   * @param perPage Elementos por página
   * @param origin Filtro por origen de la ruta
   * @param destination Filtro por destino de la ruta
   * @param sortBy Campo por el cual ordenar los resultados
   * @param sortOrder Dirección del ordenamiento (ascendente o descendente)
   * @returns Lista de rutas que cumplen los criterios
   */
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

  /**
   * Consulta para obtener una ruta específica por su ID.
   * @param id Identificador único de la ruta
   * @returns La ruta encontrada o null si no existe
   */
  @Query(() => Route, { name: 'route', nullable: true })
  route(@Args('id') id: string) {
    return this.routesService.findOne(id);
  }

  /**
   * Mutación para crear una nueva ruta con sus paradas y viajes asociados.
   * @param data Datos para crear la ruta
   * @returns La ruta creada
   */
  @Mutation(() => Route, { name: 'createRoute' })
  createRoute(@Args('data') data: CreateRouteInput) {
    return this.routesService.create(data);
  }

  /**
   * Mutación para actualizar una ruta existente.
   * Reemplaza los elementos anidados si se proporcionan.
   * @param id Identificador de la ruta a actualizar
   * @param data Nuevos datos para la ruta
   * @returns La ruta actualizada
   */
  @Mutation(() => Route, { name: 'updateRoute' })
  updateRoute(@Args('id') id: string, @Args('data') data: UpdateRouteInput) {
    return this.routesService.update(id, data);
  }

  /**
   * Mutación para eliminar una ruta.
   * @param id Identificador de la ruta a eliminar
   * @returns La ruta eliminada
   */
  @Mutation(() => Route, { name: 'removeRoute' })
  removeRoute(@Args('id') id: string) {
    return this.routesService.remove(id);
  }

  /**
   * Resuelve el campo 'stops' para una ruta.
   * Transforma los datos relacionales en una estructura adecuada para GraphQL.
   * @param route Objeto ruta del que se extraerán las paradas
   * @returns Lista ordenada de paradas para la ruta
   */
  @ResolveField(() => [StopOrder])
  stops(@Parent() route: RouteWithStops): StopOrder[] {
    return route.routeStops.map((rs) => ({
      stopOrder: rs.stopOrder,
      name: rs.stop.name,
      lat: rs.stop.latitude,
      lng: rs.stop.longitude,
    }));
  }
}
