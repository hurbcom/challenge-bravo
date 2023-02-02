import { Request, Response, Router } from 'express'
import { CurrencyService } from 'Services/Currency/CurrencyService'
import { TConvertCoin } from 'Services/Currency/types'
import { RequestError } from 'Utils'
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
} from './Validations'

class CurrencyController implements ICurrencyController {
  protected currencyService!: CurrencyService

  constructor(services: CurrencyService = new CurrencyService()) {
    this.currencyService = services
  }

  GetCurrencyByParameter = async (
    req: Request,
    res: Response
  ): Promise<Response<TConvertCoin>> => {
    try {
      const query = req.query as TGetCurrencyByParameter

      const validation = ValidateGetCurrencyByParameter.validate(query)

      if (validation.error) {
        throw new RequestError(validation.error.message, {}, 400)
      }

      const { from, to, amount } = query

      const data = await this.currencyService.convertCoin(
        from.toUpperCase(),
        to.toUpperCase(),
        +amount
      )
      return successResponse(res, { data })
    } catch (error) {
      return errorResponse(res, error)
    }
  }

  CreateNewCurrency = async (req: Request, res: Response) => {
    try {
      const body = req.body as TCreateCurrency

      const validation = ValidateCreateCurrency.validate(body)

      if (validation.error) {
        throw new RequestError(validation.error.message, {}, 400)
      }

      const { from, value } = body

      await this.currencyService.createNewCurrency(from.toUpperCase(), value)
      return successResponse(res, {}, 201)
    } catch (error) {
      return errorResponse(res, error)
    }
  }

  RemoveCurrency = async (req: Request, res: Response) => {
    try {
      const body = req.params as TDeleteCurrency

      const { coin } = body

      await this.currencyService.removeCurrency(coin.toUpperCase())
      return successResponse(res, {}, 202)
    } catch (error) {
      return errorResponse(res, error)
    }
  }
}

export const CurrencyRoutes = () => {
  const currencyController = new CurrencyController()
  const route = Router()

  route.get('/convert', currencyController.GetCurrencyByParameter)
  route.post('/new', currencyController.CreateNewCurrency)
  route.delete('/:coin', currencyController.RemoveCurrency)

  return route
}
