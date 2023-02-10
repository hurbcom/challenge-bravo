import { Request, Response } from 'express'
import Joi from 'joi'
import { RequestError } from 'Utils/RequestError'
import { errorResponse } from 'Utils/Responses'

type TObjectToValidate = 'body' | 'query'

export function ValidateRequest(
  validationSchema: Joi.Schema,
  objectToValidate: TObjectToValidate = 'body'
) {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const defaultValue = descriptor.value

    descriptor.value = async function (
      this: any,
      ...args: [Request, Response]
    ) {
      const [request, response] = args

      const validation = validationSchema.validate(request[objectToValidate])

      if (validation.error) {
        return errorResponse(
          response,
          new RequestError(validation.error.message, {}, 400)
        )
      }

      defaultValue.call(this, ...args)
    }
  }
}
