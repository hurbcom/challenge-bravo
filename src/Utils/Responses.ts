import { Response } from 'express'
import RequestError from './RequestError'

export const successResponse = (
  res: Response,
  data?: any,
  statusCode?: number
) => {
  return res.status(statusCode || 200).json(data || {})
}

export const errorResponse = (
  res: Response,
  error: RequestError | Error | unknown
) => {
  let status = 500
  let responseData = {
    message: 'An error was throwed',
    data: {}
  }

  if (error instanceof RequestError) {
    status = error.statusCode

    responseData = {
      message: error.message,
      data: error.data
    }
  } else if (error instanceof Error) {
    responseData = {
      message: error.message,
      data: {}
    }
  }

  return res.status(status).json(responseData)
}
