import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

/**
 * @about Validates request params 
 * @param shape 
 * @param paramsMethod 
 */

const validateRequest = (shape: any, paramsMethod: 'query' | 'body' | 'params' = 'query') => async (req: Request, res: Response, next: NextFunction) => {
  const schema = yup.object().shape(shape);

  try {
    await schema.validate(req[paramsMethod]);
    next();
  } catch (error) {
    res.status(400).send({ error });
  }
}

export default validateRequest;