import { Module } from '@nestjs/common';
import { RoutesResolver } from './routes.resolver';
import { RoutesService } from './routes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoutesService, RoutesResolver],
})
export class RoutesModule {}
