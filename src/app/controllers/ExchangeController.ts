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

    const { from, to, amount } = req.query;

    const schema = yup.object().shape({
      from: yup.string().required(),
      to: yup.string().required(),
      amount: yup.string().required()
    });

    const hasValidParams = await schema.isValid({ from, to, amount });

    if (!hasValidParams)
      return res.status(400).send({ error: "Invalid params" });

    const result = this.exchangeService.getExchangeBetweenCurrencies(from as string, to as string, parseFloat(amount as string));
    return res.send(result);
  }

  symbols = async (req: Request, res: Response) => {
    const symbols = await this.exchangeService.symbols();
    return res.send(symbols);
  }
}