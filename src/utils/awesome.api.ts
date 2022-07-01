import axios, { AxiosInstance } from 'axios';
import {AwesomeConversion} from './../types/awesome';

export class Awesome {
  baseUrl: string = 'https://economia.awesomeapi.com.br/last';
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: 'application/json',
      },
      params: {}
    });
  }
  // symbol:string, amount: number, convert: string
  async conversion() {
    let response: any;

    try {
      response = await this.axiosInstance.get('/USD-BRL');

    } catch (error) {
      if(axios.isAxiosError(error)){
        return error.response?.data;
      }
    }

    return response.data as AwesomeConversion;
  }
};