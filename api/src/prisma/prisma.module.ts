import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo de Prisma
 *
 * Este módulo proporciona el servicio de Prisma ORM a toda la aplicación,
 * permitiendo la interacción con la base de datos desde cualquier otro módulo.
 */
@Global() // Hace que este módulo esté disponible globalmente sin necesidad de importarlo en cada módulo
@Module({
  providers: [PrismaService], // Registra el servicio de Prisma para inyección de dependencias
  exports: [PrismaService], // Expone el servicio para que otros módulos puedan utilizarlo
})
export class PrismaModule {}
