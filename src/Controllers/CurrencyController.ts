import { Request, Response, Router } from 'express'
import { convertCoin } from 'Services/CurrencyService'
import RequestError from 'Utils/RequestError'
import { errorResponse, successResponse } from 'Utils/Responses'
import { TGetCurrencyByParameter } from './types'
import { ValidateGetCurrencyByParameter } from './Validations'

export const GetCurrencyByParameter = async (req: Request, res: Response) => {
  try {
    const query = req.query as TGetCurrencyByParameter

    const validation = ValidateGetCurrencyByParameter.validate(query)

    if (validation.error) {
      throw new RequestError(validation.error.message, {}, 400)
    }

    const { from, to, amount } = query

    const data = await convertCoin(from, to, +amount)
    return successResponse(res, { data })
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const CurrencyRoutes = () => {
  const route = Router()

  route.get('/', GetCurrencyByParameter)

  return route
}
