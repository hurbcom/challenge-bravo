import { Request, Response, NextFunction } from 'express'
import joi from 'joi'

export class DeleteCurrencyValidator {
  public async validateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = joi.object({
      code: joi.string()
        .alphanum()
        .required()
    })

    const validation = schema.validate(req.query, { abortEarly: false })

    if(validation.error) {
      return res.status(400).send({
        message: 'Was not possible to validate your request payload',
        error: validation.error
      })
    }

    next()
  }
}