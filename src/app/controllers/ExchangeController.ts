import { Request, Response } from "express";
import ExchangeService from "@services/contracts/ExchangeService";
import { injectable, inject } from "inversify";
import types from "@core/types";
import * as yup from "yup";

@injectable()
export default class ExchangeController {

  constructor(@inject(types.ExchangeService) private exchangeService: ExchangeService) {

  }

  exchange = async (req: Request, res: Response) => {
    try {
      const { from, to, amount } = req.query;
      const result = this.exchangeService.getExchangeBetweenCurrencies(from as string, to as string, parseFloat(amount as string));
      return res.send(result);
    } catch (e) {
      return res.status(500).send({ error: "Internal server error" });
    }

  }

}