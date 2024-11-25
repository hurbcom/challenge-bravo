import { FastifySchema } from 'fastify';

export const currencySchema = {
  type: 'object',
  properties: {
    code: { type: 'string', minLength: 2 },
    name: { type: 'string', minLength: 2 },
    type: { type: 'string', enum: ['fiat', 'crypto', 'fictional'] },
    rate: { type: 'number', minimum: 0 },
  },
  required: ['code', 'name', 'type', 'rate'],
};

export const conversionSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      from: { type: 'string', minLength: 2 },
      to: { type: 'string', minLength: 2 },
      amount: { type: 'number', minimum: 0 },
    },
    required: ['from', 'to', 'amount'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        from: { type: 'string' },
        to: { type: 'string' },
        amount: { type: 'number' },
        result: { type: 'number' },
        rate: { type: 'number' },
      },
    },
  },
};
