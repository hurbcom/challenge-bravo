export interface HttpServer {
  register<T>(method: Method, route: string, handler: Controller<T>): void;
  listen(port: number): void;
}

export type Method = 'get' | 'post' | 'put' | 'delete';

export type Controller<TResponse = any> = (args: ControllerParams) => Promise<TResponse>;

export type ControllerParams<T = any> = {
  query: { [key: string]: any }
  params: { [key: string]: string },
  body: T
}