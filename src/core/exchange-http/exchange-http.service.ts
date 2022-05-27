import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { AxiosResponse, HttpExchangeResponse } from './interface';

@Injectable()
export class ExchangeHttpService {

  private axiosRef: AxiosInstance = Axios.create();
  private config = {};

  constructor() {
    this.axiosRef.defaults.baseURL = process.env.EXCHANGE_API_URL;
    this.axiosRef.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    this.axiosRef.defaults.timeout = 1000 * 60 * 30;

    this.config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }

  async get(path: string): Promise<AxiosResponse<HttpExchangeResponse>> {
    try {
      return await this.axiosRef.get<HttpExchangeResponse>(path, this.config);
    } catch (exception) {
      if (exception.response)
        throw new Error(`${exception.response.status.toString()} ${exception.response.statusText}`);
      else
        throw new Error('Connection fail');
    }
  }
}
