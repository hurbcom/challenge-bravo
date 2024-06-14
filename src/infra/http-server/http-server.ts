import { Controller } from './controller';

export interface HttpServer {
  register(method: Method, route: string, handler: Controller): void;
  listen(port: number): void;
}

export type Method = 'get' | 'post' | 'put' | 'delete';
