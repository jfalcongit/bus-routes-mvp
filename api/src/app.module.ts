import { join } from 'path';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RoutesModule } from './routes/routes.module';
import { HealthController } from './health.controller';
import { MapsModule } from './maps/maps.module';

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
        level: 'error', //process.env.NODE_ENV === 'production' ? 'info' : 'debug',
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

    /**
     * Módulo que contiene la lógica de negocio para generar (usando IA) rutas de buses.
     */
    MapsModule,
  ],
  controllers: [HealthController], // Controlador para verificar el estado de la API
  providers: [], // Servicios adicionales de nivel aplicación (ninguno actualmente)
})
export class AppModule {}
