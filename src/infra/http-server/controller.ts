export interface Controller<
  TResponse extends Response = Response,
  TRequest extends Request = Request,
> {
  handle: (request: TRequest) => Promise<TResponse>;
}

export type Request = {
  query: { [key: string]: any };
  body: any;
  params: { [key: string]: string };
};

export type Response<T = any> = {
  statusCode: number;
  data: T;
};
