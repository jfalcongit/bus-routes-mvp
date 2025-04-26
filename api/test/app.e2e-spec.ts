import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Routes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // reset DB state
    await prisma.route.deleteMany();
    await prisma.stop.deleteMany();
    await prisma.trip.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/);

  it('should create a route with nested stops & trips', async () => {
    const create = `
      mutation {
        createRoute(data:{
          id:"TEST1"
          fare:123
          capacity:10
          stops:[
            {stopOrder:1 name:"X" lat:1.1 lng:2.2}
            {stopOrder:2 name:"Y" lat:3.3 lng:4.4}
          ]
          trips:[
            {departureTime:"2025-01-01T00:00:00Z" arrivalTime:"2025-01-01T00:30:00Z"}
          ]
        }) {
          id
          fare
          capacity
          stops { stopOrder name lat lng }
          trips { departureTime arrivalTime }
        }
      }
    `;
    const res = await gql(create).expect(200);
    expect(res.body.data.createRoute).toMatchObject({
      id: 'TEST1',
      fare: 123,
      capacity: 10,
      stops: [
        { stopOrder: 1, name: 'X', lat: 1.1, lng: 2.2 },
        { stopOrder: 2, name: 'Y', lat: 3.3, lng: 4.4 },
      ],
      trips: [
        {
          departureTime: '2025-01-01T00:00:00.000Z',
          arrivalTime: '2025-01-01T00:30:00.000Z',
        },
      ],
    });
  });

  it('should query with pagination & filtering', async () => {
    const query = `
      query {
        routes(page:1, perPage:5, origin:"X") {
          id
          stops { name }
        }
      }
    `;
    const res = await gql(query).expect(200);
    expect(res.body.data.routes).toHaveLength(1);
    expect(res.body.data.routes[0].id).toBe('TEST1');
  });

  it('should update a route', async () => {
    const update = `
      mutation {
        updateRoute(id:"TEST1", data:{
          fare:999
          stops:[
            {stopOrder:1 name:"X" lat:1.1 lng:2.2}
            {stopOrder:2 name:"Z" lat:5.5 lng:6.6}
          ]
        }) {
          id
          fare
          stops { name }
        }
      }
    `;
    const res = await gql(update).expect(200);
    expect(res.body.data.updateRoute.fare).toBe(999);
    expect(res.body.data.updateRoute.stops.map((s) => s.name)).toEqual([
      'X',
      'Z',
    ]);
  });

  it('should delete a route', async () => {
    const del = `
      mutation {
        removeRoute(id:"TEST1") { id }
      }
    `;
    const res = await gql(del).expect(200);
    expect(res.body.data.removeRoute.id).toBe('TEST1');

    // now routes list is empty
    const list = `
      query { routes { id } }
    `;
    const listRes = await gql(list).expect(200);
    expect(listRes.body.data.routes).toEqual([]);
  });
});
