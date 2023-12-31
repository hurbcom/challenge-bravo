export interface CurrencyResponse {
  [key : string]: {
    name: string,
    code: string,
    codeIn: string,
    basePrice: number,
    isFictitious: string,
    timestamp: string,
    create_date: string,
  }
}