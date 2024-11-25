import { FastifyInstance } from 'fastify';
import { appConfig } from '../config/application';
import { CurrencyControllerFactory } from '../controllers/factories';
import { currencySchema } from '../schemas';

const BASE_API_PATH = appConfig.BASE_API_PATH;
const API_VERSION = appConfig.API_VERSION;

export default async function routes(fastify: FastifyInstance) {
  const currencyController = CurrencyControllerFactory.create();

  fastify.get(`${BASE_API_PATH}/ping`, {
    schema: {
      tags: ['health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (_request, reply) => {
      reply.code(200).send({ message: 'pong' });
    },
  });

  fastify.get(`${BASE_API_PATH}/${API_VERSION}/convert`, {
    schema: {
      tags: ['conversion'],
      summary: 'Convert currency',
      description: 'Convert amount from one currency to another',
      querystring: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Source currency code', minLength: 2 },
          to: { type: 'string', description: 'Target currency code', minLength: 2 },
          amount: { type: 'number', description: 'Amount to convert', minimum: 0 },
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
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        return await currencyController.convertAction(request);
      } catch (error: any) {
        reply.code(400).send({ error: error.message });
      }
    },
  });

  fastify.get(`${BASE_API_PATH}/${API_VERSION}/currencies`, {
    schema: {
      tags: ['currencies'],
      description: 'Get all available currencies',
      response: {
        200: {
          type: 'array',
          items: currencySchema,
        },
      },
    },
    handler: async () => {
      return await currencyController.getAllCurrenciesAction();
    },
  });

  fastify.post(`${BASE_API_PATH}/${API_VERSION}/currencies`, {
    schema: {
      tags: ['currencies'],
      description: 'Add a new currency',
      body: currencySchema,
      response: {
        201: currencySchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const currency = await currencyController.addCurrencyAction(request);
        reply.code(201).send(currency);
      } catch (error: any) {
        reply.code(400).send({ error: error.message });
      }
    },
  });

  fastify.delete(`${BASE_API_PATH}/${API_VERSION}/currencies/:code`, {
    schema: {
      tags: ['currencies'],
      description: 'Delete a currency by its code',
      params: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Currency code' },
        },
        required: ['code'],
      },
      response: {
        204: {
          type: 'null',
          description: 'Currency successfully deleted',
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        await currencyController.deleteCurrencyAction(request);
        reply.code(204).send();
      } catch (error: any) {
        reply.code(400).send({ error: error.message });
      }
    },
  });
}
