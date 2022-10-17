import { Request, Response, NextFunction } from 'express'
import joi from 'joi'

export class CurrencyConversionValidator {
  public async validateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = joi.object({
      from: joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
  
      to: joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
      
      amount: joi.number()
        .positive()
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