import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio de Prisma
 *
 * Este servicio encapsula la funcionalidad del cliente de Prisma ORM
 * para interactuar con la base de datos. Se encarga de establecer
 * la conexión al iniciar el módulo y cerrarla al finalizar.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Se ejecuta cuando el módulo se inicializa
   * Establece la conexión con la base de datos
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Se ejecuta cuando el módulo se destruye
   * Cierra la conexión con la base de datos
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
