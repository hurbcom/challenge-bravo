import { injectable, inject } from "inversify";
import { Request, Response, response } from "express";

import types from "@core/types";

import CurrencyService from "@services/contracts/CurrencyService";
import UnsupportedSymbolError from "@errors/UnsuportedSymbolError";

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

  create = async (req: Request, res: Response) => {
    const currency = await this.currencyService
      .create(req.body)
      .catch(error => {
        if (error instanceof UnsupportedSymbolError)
          return res.status(422).send({ error: "Unsupported currency symbol" });

        return res.status(500).send({ error: "Internal server error" });
      });

    return res.status(currency ? 201 : 422).send(currency || { error: "Unsupported currency symbol" });
  }

  delete = async (req: Request, res: Response) => {
    const deleted = await this.currencyService.delete(parseInt(req.params.id));
    return res.send({ deleted })
  }
}