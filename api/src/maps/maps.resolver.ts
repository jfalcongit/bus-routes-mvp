/**
 * MapsResolver: Resuelve operaciones GraphQL relacionadas con generación de rutas
 */
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MapsService } from './maps.service';
import { Stop } from './dto/maps.dto';

@Resolver()
export class MapsResolver {
  constructor(private readonly mapsService: MapsService) {}

  /**
   * Genera una lista de paradas de ruta con puntos intermedios seleccionados por IA.
   * Recibe un origen y destino y devuelve la ruta completa con paradas.
   */
  @Mutation(() => [Stop], { name: 'generateRouteStopsWithAI' })
  async generateRouteStopsWithAI(
    @Args('origin', { type: () => Stop }) origin: Stop,
    @Args('destination', { type: () => Stop }) destination: Stop,
  ): Promise<Stop[]> {
    return this.mapsService.generateRouteStopsWithAI(origin, destination);
  }
}
