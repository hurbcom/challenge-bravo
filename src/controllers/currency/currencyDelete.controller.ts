import { Request, Response } from "express";
import currencyDeleteService from "../../services/currency/currencyDelete.service";


const currecyDeleteController =async (req: Request, res: Response) => {
  const { currency_id } = req.params;
  
  await currencyDeleteService(currency_id);

  return res.status(204).send();
}

export default currecyDeleteController;