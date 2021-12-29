import {Currency} from "./currency";

export interface ConvertResponse {
  amount: number
  quote: number
  from?: Currency
  to?: Currency
}
