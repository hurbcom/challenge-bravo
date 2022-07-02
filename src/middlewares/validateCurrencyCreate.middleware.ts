import { Request, Response, NextFunction} from 'express';
import { IcurrecyCreate } from '../types/currecy';

import * as yup from "yup";
import { SchemaOf } from 'yup';

export const validateCurrecyCreateSchema: SchemaOf<IcurrecyCreate> = yup.object().shape({
  symbol: yup.string().required().max(9).matches(
    /^[aA-zZ]+$/,
    "Must contain only characters A to Z"
  ).transform((value, originalValue) => originalValue.toUpperCase()),
  name: yup.string().required().max(255),
  amount: yup.number().required(),
  price: yup.number().required()
})

export const validateCurrencyCreate = (schema: SchemaOf<IcurrecyCreate>) => {
  return async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
      try {
          const data = req.body;
          console.log(data)

          try {
            const validatedData = await schema.validate(
                data, 
                { 
                    abortEarly: false,
                    stripUnknown: true
                })
            req.body = validatedData;
            next();

          } catch (err: any) {
              return res.status(400).json({
                  error: err.errors?.join(', ')
              });
          }

      } catch (err) {
          next(err);
      }
  }
}