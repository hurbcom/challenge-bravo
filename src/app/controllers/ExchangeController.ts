import { Request, Response } from "express";
import ExchangeService from "@services/contracts/ExchangeService";
import { injectable, inject } from "inversify";
import types from "@core/types";
import UnsupportedSymbolError from "@utils/errors/UnsuportedSymbolError";
import ExchangeRateError from "@utils/errors/ExchangeRateError";


@injectable()
export default class ExchangeController {

  constructor(@inject(types.ExchangeService) private exchangeService: ExchangeService) { }

  exchange = async (req: Request, res: Response) => {
    try {
      const { from, to, amount } = req.query;
      const result = await this.exchangeService.getExchangeBetweenCurrencies(from as string, to as string, parseFloat(amount as string));
      return res.send(result);
    } catch (e) {
      if (e instanceof UnsupportedSymbolError)
        return res.status(422).send({ error: "One or more currency symbols present on the request are not supported by the applicaiton, make sure they exists in database before using" });

      if (e instanceof ExchangeRateError)
        return res.status(500).send({ error: "Could not determine exchange rate between these currencies" });

      return res.status(500).send({ error: "Internal server error" });
    }
  }

}