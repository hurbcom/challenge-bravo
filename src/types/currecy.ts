export interface IcurrecyRequest {
  from: string;
  to: string;
  amount: string;
}

export interface IcurrecyCreate {
  symbol: string;
  name: string;
  amount: number;
  price: number;
}

export interface Icurrency {
  id: string;
  last_updated: Date;
  date_added: Date;
  symbol: string;
  name: string;
  price: number;
}

export interface IcurrencyUpdate {
  name?: string;
  price?: number;
  last_updated?: Date; 
}

export interface IcurrencyUpdateSchema {
  name?: string;
  amount?: number;
  price?: number;
}