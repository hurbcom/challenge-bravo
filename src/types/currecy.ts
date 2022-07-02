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
