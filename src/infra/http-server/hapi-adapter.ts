import { Controller, HttpServer, Method } from '@/infra/http-server/http-server';

import Hapi from '@hapi/hapi';

export class HapiAdapter implements HttpServer {
  private server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({});
  }

  register<T>(method: Method, route: string, handler: Controller<T>): void {
    this.server.route({
      method,
      path: route,
      handler: async (req, res) => {
        try {
          const result = await handler({ query: req.query, params: req.params, body: req.payload });
          return result;
        } catch (error: any) {
          return res.response({ message: error.message }).code(500);
        }
      },
    })
  }


  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }
}
