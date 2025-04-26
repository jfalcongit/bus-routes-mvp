import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { RoutesModule } from './routes/routes.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthController } from './health.controller';

/**
 * Módulo principal de la aplicación.
 * Configura todos los componentes, servicios y controladores necesarios
 * para el funcionamiento de la API de rutas de buses.
 */
@Module({
  imports: [
    /**
     * Configuración del sistema de logging usando nestjs-pino.
     * Ajusta el nivel de detalle según el entorno (producción o desarrollo).
     */
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),

    /**
     * Configuración de GraphQL con Apollo Server.
     * Genera automáticamente el esquema a partir de los decoradores TypeScript.
     */
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      debug: true,
      // TODO: Dejo esto intencionalmente para mantener playground activo
      // playground: process.env.NODE_ENV !== 'production',
      // debug: process.env.NODE_ENV !== 'production',
    }),

    /**
     * Módulo para la conexión con la base de datos usando Prisma ORM.
     */
    PrismaModule,

    /**
     * Módulo que contiene la lógica de negocio para gestionar rutas de buses.
     */
    RoutesModule,
  ],
  controllers: [HealthController], // Controlador para verificar el estado de la API
  providers: [], // Servicios adicionales de nivel aplicación (ninguno actualmente)
})
export class AppModule {}
