import { Response } from 'express'
import { requestCoin } from 'Services/CoinBase'
import { CurrencyService } from 'Services/CurrencyService'
import { TConvertCoin } from 'Services/CurrencyService/types'
import { ValidateRequest } from 'Utils/Decorators/ValidateRequest'
import { errorResponse, successResponse } from 'Utils/Responses'
import {
  TCreateCurrency,
  TGetCurrencyByParameter,
  TDeleteCurrency,
  ICurrencyController
} from './types'
import {
  ValidateGetCurrencyByParameter,
  ValidateCreateCurrency
} from './validations'

export class CurrencyController implements ICurrencyController {
  private currencyService!: CurrencyService

  constructor(services: CurrencyService = new CurrencyService(requestCoin)) {
    this.currencyService = services

    this.GetCurrencyByParameter = this.GetCurrencyByParameter.bind(this)
    this.CreateNewCurrency = this.CreateNewCurrency.bind(this)
    this.RemoveCurrency = this.RemoveCurrency.bind(this)
  }

  @ValidateRequest(ValidateGetCurrencyByParameter, 'query')
  async GetCurrencyByParameter(
    req: TGetCurrencyByParameter,
    res: Response
  ): Promise<Response<TConvertCoin>> {
    try {
      const query = req.query

      const { from, to, amount } = query

      const data = await this.currencyService.convertCoin(
        from.toUpperCase(),
        to.toUpperCase(),
        +amount
      )
      return successResponse(res, { data })
    } catch (error) {
      console.log('error:::', error)
      return errorResponse(res, error)
    }
  }

  @ValidateRequest(ValidateCreateCurrency)
  async CreateNewCurrency(req: TCreateCurrency, res: Response) {
    try {
      const body = req.body

      const { from, value } = body

      await this.currencyService.createNewCurrency(from.toUpperCase(), value)
      return successResponse(res, {}, 201)
    } catch (error) {
      return errorResponse(res, error)
    }
  }

  async RemoveCurrency(req: TDeleteCurrency, res: Response) {
    try {
      const body = req.params

      const { coin } = body

      await this.currencyService.removeCurrency(coin.toUpperCase())
      return successResponse(res, {}, 202)
    } catch (error) {
      return errorResponse(res, error)
    }
  }
}
