import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { Prisma, Route as RouteModel } from '@prisma/client';

/**
 * Servicio para gestionar operaciones CRUD de rutas de buses.
 * Proporciona métodos para crear, leer, actualizar y eliminar rutas,
 * así como para realizar búsquedas con filtros y paginación.
 */
@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca rutas con filtros opcionales y paginación.
   * @param page Número de página actual (inicia en 1)
   * @param perPage Cantidad de elementos por página
   * @param origin Filtro por nombre de origen (parcial, no sensible a mayúsculas)
   * @param destination Filtro por nombre de destino (parcial, no sensible a mayúsculas)
   * @param sortBy Campo por el cual ordenar (origen o destino)
   * @param sortOrder Dirección del ordenamiento (asc o desc)
   * @returns Lista de rutas que coinciden con los criterios
   */
  async findAll(
    page = 1,
    perPage = 20,
    origin?: string,
    destination?: string,
    sortBy?: 'origin' | 'destination',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<RouteModel[]> {
    // Validar parámetros de paginación
    const validPage = Math.max(1, page);
    const validPerPage = Math.max(1, Math.min(100, perPage));

    const where: Prisma.RouteWhereInput = {};
    if (origin) {
      where.originStop = { name: { contains: origin, mode: 'insensitive' } };
    }
    if (destination) {
      where.destinationStop = {
        name: { contains: destination, mode: 'insensitive' },
      };
    }

    const orderBy = sortBy
      ? {
          [sortBy === 'origin' ? 'originStop' : 'destinationStop']: {
            name: sortOrder,
          },
        }
      : undefined;

    return this.prisma.route.findMany({
      where,
      skip: (validPage - 1) * validPerPage,
      take: validPerPage,
      orderBy,
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' }, include: { stop: true } },
        trips: true,
      },
    });
  }

  /**
   * Busca una ruta por su ID.
   * @param id Identificador único de la ruta
   * @returns Datos completos de la ruta
   * @throws NotFoundException si la ruta no existe
   */
  async findOne(id: string): Promise<RouteModel> {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' }, include: { stop: true } },
        trips: true,
      },
    });
    if (!route) throw new NotFoundException(`Route with id=${id} not found`);
    return route;
  }

  /**
   * Crea una nueva ruta con sus paradas y viajes.
   * @param data Datos para crear la ruta
   * @returns Ruta creada con todos sus datos relacionados
   */
  async create(data: CreateRouteInput): Promise<RouteModel> {
    const origin = data.stops[0];
    const destination = data.stops[data.stops.length - 1];

    return this.prisma.route.create({
      data: {
        id: data.id,
        fare: data.fare,
        capacity: data.capacity,

        originStop: {
          connectOrCreate: {
            where: { name: origin.name },
            create: {
              name: origin.name,
              latitude: origin.lat,
              longitude: origin.lng,
            },
          },
        },

        destinationStop: {
          connectOrCreate: {
            where: { name: destination.name },
            create: {
              name: destination.name,
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },

        routeStops: {
          create: data.stops.map((s) => ({
            stopOrder: s.stopOrder,
            stop: {
              connectOrCreate: {
                where: { name: s.name },
                create: {
                  name: s.name,
                  latitude: s.lat,
                  longitude: s.lng,
                },
              },
            },
          })),
        },

        trips: {
          create: data.trips ?? [],
        },
      },
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' }, include: { stop: true } },
        trips: true,
      },
    });
  }

  /**
   * Actualiza una ruta existente.
   * Si se proporcionan paradas o viajes, se eliminan los existentes y se crean nuevos.
   * @param id Identificador de la ruta a actualizar
   * @param data Datos parciales para actualizar la ruta
   * @returns Ruta actualizada con todos sus datos relacionados
   * @throws NotFoundException si la ruta no existe
   */
  async update(id: string, data: UpdateRouteInput): Promise<RouteModel> {
    // Usa transacción para garantizar atomicidad en las operaciones
    return this.prisma.$transaction(async (tx) => {
      // Verificar que la ruta existe
      const existingRoute = await tx.route.findUnique({
        where: { id },
      });

      if (!existingRoute) {
        throw new NotFoundException(`Route with id=${id} not found`);
      }

      // Actualizar origen/destino si se proporcionan nuevas paradas
      const updateData: Prisma.RouteUpdateInput = {};
      if (data.fare !== undefined) updateData.fare = data.fare;
      if (data.capacity !== undefined) updateData.capacity = data.capacity;

      // Eliminar y recrear paradas si se proporcionan
      if (data.stops) {
        await tx.routeStop.deleteMany({ where: { routeId: id } });

        // Actualizar origen/destino si hay nuevas paradas
        const origin = data.stops[0];
        const destination = data.stops[data.stops.length - 1];

        updateData.originStop = {
          connectOrCreate: {
            where: { name: origin.name },
            create: {
              name: origin.name,
              latitude: origin.lat,
              longitude: origin.lng,
            },
          },
        };

        updateData.destinationStop = {
          connectOrCreate: {
            where: { name: destination.name },
            create: {
              name: destination.name,
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        };

        updateData.routeStops = {
          create: data.stops.map((s) => ({
            stopOrder: s.stopOrder,
            stop: {
              connectOrCreate: {
                where: { name: s.name },
                create: { name: s.name, latitude: s.lat, longitude: s.lng },
              },
            },
          })),
        };
      }

      // Eliminar y recrear viajes si se proporcionan
      if (data.trips) {
        await tx.trip.deleteMany({ where: { routeId: id } });
        updateData.trips = {
          create: data.trips,
        };
      }

      // Realizar la actualización
      return tx.route.update({
        where: { id },
        data: updateData,
        include: {
          routeStops: {
            orderBy: { stopOrder: 'asc' },
            include: { stop: true },
          },
          trips: true,
        },
      });
    });
  }

  /**
   * Elimina una ruta por su ID.
   * @param id Identificador de la ruta a eliminar
   * @returns Datos de la ruta eliminada
   * @throws NotFoundException si la ruta no existe
   */
  async remove(id: string): Promise<RouteModel> {
    // Verificar que la ruta existe antes de intentar eliminarla
    const route = await this.prisma.route.findUnique({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with id=${id} not found`);
    }

    return this.prisma.route.delete({ where: { id } });
  }
}
