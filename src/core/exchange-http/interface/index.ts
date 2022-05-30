export interface Motd {
    msg: string;
    url: string;
}

export interface HttpExchangeResponse {
    motd: Motd;
    success: boolean;
    base: string;
    date: string;
    rates: any;
}

export interface AxiosResponse<T = any>  {
    data: T;
    status: number;
    statusText: string;
    headers: any;
  }




