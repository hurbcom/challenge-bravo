import { Request, Response } from 'express'
import { Controller } from '../../presentation/controllers/protocols/controller'
import { HttpRequest } from '../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      params: req.params,
      query: req.query,
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)
    httpResponse.body?.message
      ? res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
      : res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
