import { HttpServer, Method } from '@/infra/http-server';
import { Controller, Request } from '@/infra/http-server/controller';
import swaggerDocument from '@/infra/http-server/swagger.json';
import SwaggerUi from 'swagger-ui-express';

import express, { Express } from 'express';

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(
      '/api-docs',
      SwaggerUi.serve,
      SwaggerUi.setup(swaggerDocument)
    );
  }

  register(method: Method, route: string, controller: Controller): void {
    this.app[method](
      route.replace('}', '').replace('{', ':'),
      async (req, res) => {
        try {
          const request: Request = {
            query: req.query,
            params: req.params,
            body: req.body,
          };
          const response = await controller.handle(request);
          res.status(response.statusCode).json(response.data);
        } catch (error: any) {
          res
            .status(500)
            .json({ message: error.message || 'An unexpected error occurred' });
        }
      }
    );
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
