import { injectable, inject } from "inversify";
import types from "@core/types";
import CurrencyService from "@services/contracts/CurrencyService";
import { Request, Response } from "express";

@injectable()
export default class CurrencyController {

  constructor(@inject(types.CurrencyService) private currencyService: CurrencyService) { }

  index = async (req: Request, res: Response) => {
    const currencies = await this.currencyService.index();
    res.send(currencies);
  }

  find = async (req: Request, res: Response) => {
    const currency = await this.currencyService.findById(parseInt(req.params.id));
    return res.send(currency);
  }

  findBySymbol = async (req: Request, res: Response) => {
    const currency = await this.currencyService.findBySymbol(req.params.symbol);
    return res.send(currency);
  }

}