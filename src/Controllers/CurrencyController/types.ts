import { Request, Response } from 'express'
import { TConvertCoin } from 'Services/CurrencyService/types'

export interface ICurrencyController {
  GetCurrencyByParameter: (
    req: TGetCurrencyByParameter,
    res: Response
  ) => Promise<Response<TConvertCoin>>
  CreateNewCurrency: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
  RemoveCurrency: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>
}

export interface TGetCurrencyByParameter extends Express.Request {
  query: {
    from: string
    to: string
    amount: string
  }
}

export type TCreateCurrency = {
  from: string
  value: number
}

export type TDeleteCurrency = {
  coin: string
}
