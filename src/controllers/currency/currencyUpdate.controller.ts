import { Request, Response } from "express";
import currencyUpdateService from "../../services/currency/currencyUpdate.service";
import { validate } from "uuid"
import { AppError } from "../../errors/appError";

const currecyUpdateController =async (req: Request, res: Response) => {
  const body = req.body;
  const { currency_id } = req.params;

  const isRealUuid = validate(currency_id);
  
  if (!isRealUuid) {
    throw new AppError(400, "Currency is not valid!");
  }

  const result = await currencyUpdateService(body, currency_id);
  
  return res.status(200).send(result);
}

export default currecyUpdateController; 