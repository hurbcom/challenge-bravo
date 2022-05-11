import axios from 'axios';

export type RequestHttpOptions = {
  method: Method;
  url: string;
  body?: any;
  headers?: any;
};

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete';

export class HttpClient {
  public async makeRequest(httpOptions: RequestHttpOptions) {
    const response = await axios.request(httpOptions);
    return response;
  }
}
