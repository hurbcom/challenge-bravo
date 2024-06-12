export interface CurrencyApiGateway {
  getCurrencies(filters?: Filters): Promise<CurrenciesResponse>;
  getRates(filters?: Filters): Promise<RateResponse>;
}

export type Filters = { currencies?: string[], type?: CurrencyType }

export type CurrencyType = 'fiat' | 'metal' | 'crypto'

export type CurrenciesResponse = {
  data: {
    [key: string]: {
      symbol: string
      name: string
      symbol_native: string
      decimal_digits: number
      rounding: number
      code: string
      name_plural: string
      type: CurrencyType
      countries: string[]
    }
  }
}

export type RateResponse = {
  meta: {
    last_updated_at: Date
  }
  data: {
    [key: string]: {
      code: string
      value: number
    }
  }
}

export default CurrencyApiGateway;