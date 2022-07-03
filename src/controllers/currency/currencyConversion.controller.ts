import { Request, Response } from "express";
import { IcurrecyRequest } from "../../types/currecy";
import currecyConversionService from "../../services/currency/currecyConversion.service";
import currencyListService from "../../services/currency/currencyList.service";

const currecyListController =async (req: Request, res: Response) => {
  const {from, to, amount} = req.query as unknown as IcurrecyRequest;

  let result: any;

  if (Object.keys(req.query).length === 0) {
    result = await currencyListService();
    
  } else {
    result = await currecyConversionService({from, to, amount});
  }


  return res.status(200).send(result);
}

export default currecyListController;