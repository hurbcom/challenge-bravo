import { Request, Response, NextFunction} from 'express';
import * as yup from "yup";
import { SchemaOf } from 'yup';

import { IcurrencyUpdateSchema } from '../../types/currecy';

export const validateCurrecyUpdateSchema: SchemaOf<IcurrencyUpdateSchema> = yup.object().shape({
  name: yup.string().max(255),
  amount: yup.number(),
  price: yup.number()
})

export const validateCurrencyUpdate = (schema: SchemaOf<IcurrencyUpdateSchema>) => {
  return async (
    req: Request,
    res: Response, 
    next: NextFunction) => {
      try {
          const data = req.body;

          try {
            const validatedData = await schema.validate(
                data, 
                { 
                    abortEarly: false,
                    stripUnknown: true
                })

            if (validatedData.amount && validatedData.price) {
              validatedData.price = validatedData.price/validatedData.amount;
              delete validatedData["amount"];

            } else if (validatedData.price || validatedData.amount) {
              return res.status(400).json({"message": "If you to want update the currency, you need to give an amount and price!"})
            }

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