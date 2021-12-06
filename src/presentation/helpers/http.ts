import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const created = (data:any): HttpResponse => ({
  statusCode: 201,
  body: data
})
export const accepted = (data:any): HttpResponse => ({
  statusCode: 202,
  body: data
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
