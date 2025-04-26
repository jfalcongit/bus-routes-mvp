import { Module } from '@nestjs/common';
import { RoutesResolver } from './routes.resolver';
import { RoutesService } from './routes.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Módulo de Rutas
 *
 * Este módulo gestiona las funcionalidades relacionadas con las rutas de autobuses.
 * Integra el servicio y el resolver de rutas, y depende del módulo Prisma
 * para la comunicación con la base de datos.
 */
@Module({
  imports: [PrismaModule],
  providers: [RoutesService, RoutesResolver],
})
export class RoutesModule {}
