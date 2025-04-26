import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { Prisma, Route as RouteModel } from '@prisma/client';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page = 1,
    perPage = 20,
    origin?: string,
    destination?: string,
    sortBy?: 'origin' | 'destination',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<RouteModel[]> {
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
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' }, include: { stop: true } },
        trips: true,
      },
    });
  }

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

  async update(id: string, data: UpdateRouteInput): Promise<RouteModel> {
    // remove old children if arrays are provided
    if (data.stops) {
      await this.prisma.routeStop.deleteMany({ where: { routeId: id } });
    }
    if (data.trips) {
      await this.prisma.trip.deleteMany({ where: { routeId: id } });
    }

    return this.prisma.route.update({
      where: { id },
      data: {
        fare: data.fare,
        capacity: data.capacity,
        routeStops: data.stops
          ? {
              create: data.stops.map((s) => ({
                stopOrder: s.stopOrder,
                stop: {
                  connectOrCreate: {
                    where: { name: s.name },
                    create: { name: s.name, latitude: s.lat, longitude: s.lng },
                  },
                },
              })),
            }
          : undefined,
        trips: data.trips
          ? {
              create: data.trips,
            }
          : undefined,
      },
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' }, include: { stop: true } },
        trips: true,
      },
    });
  }

  async remove(id: string): Promise<RouteModel> {
    return this.prisma.route.delete({ where: { id } });
  }
}
