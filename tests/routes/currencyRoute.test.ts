import fastify, { FastifyInstance } from 'fastify';
import currencyRoutes from '../../src/routes/currencyRoute';

jest.mock('../../src/controllers/currencyController', () => ({
  convertCurrencyHandler: jest.fn(async (request, reply) => {
    reply.send({ convertedAmount: '85' });
  }),
  addCurrencyHandler: jest.fn(async (request, reply) => {
    reply.code(201).send({
      code: 'BTC',
      type: 'CRYPTO',
      conversionRateToUSD: 50000
    });
  }),
  removeCurrencyHandler: jest.fn(async (request, reply) => {
    reply.code(204).send();
  }),
  getCurrencyHandler: jest.fn(async (request, reply) => {
    reply.send({
      code: 'USD',
      type: 'FIAT',
      unit: 'Dollar'
    });
  }),
  getCurrenciesHandler: jest.fn(async (request, reply) => {
    reply.send([
      { code: 'USD', type: 'FIAT', unit: 'Dollar' },
      { code: 'EUR', type: 'FIAT', unit: 'Euro' }
    ]);
  })
}));

let app: FastifyInstance;

beforeAll(async () => {
  app = fastify();
  app.register(currencyRoutes);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('should convert currency on GET /convert', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/convert',
    query: {
      from: 'USD',
      to: 'EUR',
      amount: '100'
    }
  });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toHaveProperty('convertedAmount', '85');
});

it('should add a currency on POST /currencies', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/currencies',
    payload: {
      code: 'BTC',
      type: 'CRYPTO',
      conversionRateToUSD: 50000
    }
  });
  expect(response.statusCode).toBe(201);
  expect(response.json()).toEqual({
    code: 'BTC',
    type: 'CRYPTO',
    conversionRateToUSD: 50000
  });
});

it('should remove a currency on DELETE /currencies/:code', async () => {
  const response = await app.inject({
    method: 'DELETE',
    url: '/currencies/BTC'
  });
  expect(response.statusCode).toBe(204);
});

it('should get a currency on GET /currencies/:code', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/currencies/USD'
  });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({
    code: 'USD',
    type: 'FIAT',
    unit: 'Dollar'
  });
});

it('should get all currencies on GET /currencies', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/currencies'
  });
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.json())).toBe(true);
  expect(response.json()).toEqual([
    { code: 'USD', type: 'FIAT', unit: 'Dollar' },
    { code: 'EUR', type: 'FIAT', unit: 'Euro' }
  ]);
});
