import { injectable, inject } from "inversify";
import { Request, Response } from "express";

import types from "@core/types";

import CurrencyService from "@services/contracts/CurrencyService";
import UnsupportedSymbolError from "@errors/UnsuportedSymbolError";
import DuplicatedSymbolError from "@utils/errors/DuplicatedSymbolError";

@injectable()
export default class CurrencyController {

  constructor(@inject(types.CurrencyService) private currencyService: CurrencyService) { }

  index = async (req: Request, res: Response) => {
    try {
      const currencies = await this.currencyService.index();
      res.send(currencies);
    } catch (e) {
      res.status(500).send({ error: "Internal server error" });
    }
  }

  find = async (req: Request, res: Response) => {
    try {
      const currency = await this.currencyService.findById(parseInt(req.params.id));
      return res.send(currency);
    } catch (e) {
      res.status(500).send({ error: "Internal server error" });
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const currency = await this.currencyService.create(req.body);
      return res.status(201).send(currency);
    } catch (e) {
      if (e instanceof UnsupportedSymbolError)
        return res.status(422).send({ error: "Unsupported currency symbol" });

      if (e instanceof DuplicatedSymbolError)
        return res.status(409).send({ error: "There is already a currency with that symbol in the database" });

      console.error(e);
      return res.status(500).send({ error: "Internal server error" });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const currency = await this.currencyService.update(parseInt(req.params.id), req.body);
      return res.send(currency);
    } catch (e) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await this.currencyService.delete(parseInt(req.params.id));
      return res.send({ deleted });
    } catch (e) {
      return res.status(500).send({ error: "Internal server error" });
    }

  }
}