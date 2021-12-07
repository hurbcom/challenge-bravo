import { HTTPClient } from '../../infra/services/protocols/http-client'
import { HttpResponse } from '../../presentation/protocols/http'
import axios from 'axios'
export class AxiosAdapter implements HTTPClient {
  constructor (private readonly baseUrl?:string) {}
  async call (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS', body?: any, headers?: any): Promise<HttpResponse> {
    const instance = axios.create({ baseURL: this.baseUrl, validateStatus: function (status) { return true } })
    const response = await instance.request({ method, data: body, url, headers })
    return { statusCode: response.status, body: response.data }
  }
}
