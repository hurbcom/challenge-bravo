import { Response } from 'express'
import { requestCoin } from 'Services/CoinBase'
import { CurrencyService } from 'Services/CurrencyService'
import { TConvertCoin } from 'Services/CurrencyService/types'
import { ValidateRequest } from 'Utils/Decorators/ValidateRequest'
import { errorResponse, successResponse } from 'Utils'
import {
  TCreateCurrency,
  TGetCurrencyByParameter,
  TDeleteCurrency,
  ICurrencyController,
  TUpdateCurrency
} from './types'
import {
  ValidateGetCurrencyByParameter,
  ValidateCreateCurrency,
  ValidateUpdateCurrency
} from './validations'

export class CurrencyController implements ICurrencyController {
  private currencyService!: CurrencyService

  constructor(services: CurrencyService = new CurrencyService(requestCoin)) {
    this.currencyService = services
  }

  @ValidateRequest(ValidateGetCurrencyByParameter, 'query')
  async GetCurrencyByParameter(
    req: TGetCurrencyByParameter,
    res: Response
  ): Promise<Response<TConvertCoin>> {
    try {
      const { from, to, amount } = req.query

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
      const { from, value } = req.body

      await this.currencyService.createNewCurrency(from.toUpperCase(), value)
      return successResponse(res, {}, 201)
    } catch (error) {
      return errorResponse(res, error)
    }
  }

  @ValidateRequest(ValidateUpdateCurrency)
  async UpdateCurrency(req: TUpdateCurrency, res: Response) {
    try {
      const { value } = req.body
      const { coin } = req.params

      await this.currencyService.updateCurrency(coin.toUpperCase(), value)
      return successResponse(res, {}, 201)
    } catch (error) {
      return errorResponse(res, error)
    }
  }

  async RemoveCurrency(req: TDeleteCurrency, res: Response) {
    try {
      const { coin } = req.params

      await this.currencyService.removeCurrency(coin.toUpperCase())
      return successResponse(res, {}, 202)
    } catch (error) {
      return errorResponse(res, error)
    }
  }
}
