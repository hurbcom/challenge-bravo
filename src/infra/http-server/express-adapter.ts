import { Controller, HttpServer, Method } from '@/infra/http-server';
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

  register<T>(method: Method, route: string, handler: Controller<T>): void {
    this.app[method](
      route.replace('}', '').replace('{', ':'),
      async (req, res) => {
        try {
          const result = await handler({
            query: req.query,
            params: req.params,
            body: req.body,
          });
          res.json(result);
        } catch (error: any) {
          res.status(500).json({ message: error.message });
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
