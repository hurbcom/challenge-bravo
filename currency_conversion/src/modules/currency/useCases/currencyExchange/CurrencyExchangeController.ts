import { Request, Response } from "express";
import { container } from "tsyringe";

import { CurrencyExchangeUseCase } from "./CurrencyExchangeUseCase";

class CurrencyExchangeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { to, from, amount } = request.query;

    const currencyExchangeUseCase = container.resolve(CurrencyExchangeUseCase);

    const conversion = await currencyExchangeUseCase.execute({
      to: to as string,
      from: from as string,
      amount: amount as any,
    });

    console.log(conversion);

    return response.json({ conversion });
  }
}

export { CurrencyExchangeController };
