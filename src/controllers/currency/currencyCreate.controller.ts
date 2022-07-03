import { Request, Response } from "express";
import currecyCreateService from "../../services/currency/currecyCreate.service";


const currecyCreateController =async (req: Request, res: Response) => {
  const {symbol, name, amount, price} = req.body;
  
  const result = await currecyCreateService({symbol, name, amount, price});

  return res.status(201).send(result);
}

export default currecyCreateController;