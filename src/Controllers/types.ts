import { Request, Response } from 'express'
import { TConvertCoin } from 'Services/types'

export interface ICurrencyController {
  GetCurrencyByParameter: (
    req: Request,
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

export type TGetCurrencyByParameter = {
  from: string
  to: string
  amount: string
}

export type TCreateCurrency = {
  from: string
  value: number
}

export type TDeleteCurrency = {
  coin: string
}
