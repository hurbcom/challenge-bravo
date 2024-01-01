export interface CurrencyResponse {
  [key : string]: {
    name: string,
    code: string,
    codeIn: string,
    bid: number,
    isFictitious: string,
    timestamp: string,
    create_date: string,
  }
}