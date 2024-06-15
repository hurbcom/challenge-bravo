import { HttpServer, Method } from '@/infra/http-server';
import { Controller, Request } from '@/infra/http-server/controller';

import Hapi from '@hapi/hapi';

export class HapiAdapter implements HttpServer {
  private server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({});
  }

  register(method: Method, route: string, controller: Controller): void {
    this.server.route({
      method,
      path: route,
      handler: async (req, res) => {
        try {
          const request: Request = {
            query: req.query,
            params: req.params,
            body: req.payload,
          };
          const result = await controller.handle(request);
          return res.response(result.data).code(result.statusCode);
        } catch (error: any) {
          return res
            .response({
              message: error.message || 'An unexpected error occurred',
            })
            .code(500);
        }
      },
    });
  }

  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }
}
