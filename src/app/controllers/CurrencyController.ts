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

}