import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { appConfig } from './config/application';
import routes from './routes';

const app = fastify({
  logger: true,
});

app.register(swagger, {
  openapi: {
    info: {
      title: 'Currency Converter API',
      description: 'API for converting between different types of currencies',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${appConfig.SERVER_PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'health', description: 'Health check endpoints' },
      { name: 'currencies', description: 'Currency management endpoints' },
      { name: 'conversion', description: 'Currency conversion endpoints' },
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

app.register(routes);

export default app;
