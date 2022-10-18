import { Request, Response, NextFunction } from 'express'
import joi from 'joi'

export class CreateCurrencyValidator {
  public async validateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = joi.object({
      code: joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
  
      backedCurrencyCode: joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
      
      unitCost: joi.number()
        .positive()
        .required()
    })

    const validation = schema.validate(req.body, { abortEarly: false })

    if(validation.error) {
      return res.status(400).send({
        message: 'Was not possible to validate your request payload',
        error: validation.error
      })
    }

    next()
  }
}