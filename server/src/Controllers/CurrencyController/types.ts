import { Request, Response } from 'express'
import { TConvertCoin } from 'Services/CurrencyService/types'

export interface ICurrencyController {
  GetCurrencyByParameter: (
    req: TGetCurrencyByParameter,
    res: Response
  ) => Promise<Response<TConvertCoin>>
  CreateNewCurrency: (
    req: TCreateCurrency,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
  UpdateCurrency: (
    req: TUpdateCurrency,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
  RemoveCurrency: (
    req: TDeleteCurrency,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
}

export interface TGetCurrencyByParameter extends Request {
  query: {
    from: string
    to: string
    amount: string
  }
}

export interface TCreateCurrency extends Request {
  body: {
    from: string
    value: number
  }
}

export interface TUpdateCurrency extends Request {
  params: {
    coin: string
  }
  body: {
    value: number
  }
}

export interface TDeleteCurrency extends Request {
  params: {
    coin: string
  }
}
