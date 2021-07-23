import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ConvertCurrencyService } from '@services/ConvertCurrencyService';

export class CurrencyConverterController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { from, to, amount } = req.query;

    const convertCurrencyService = container.resolve(ConvertCurrencyService);

    const result = await convertCurrencyService.execute({
      from: from as string,
      to: to as string,
      amount: amount as string,
    });

    return res.json({ result });
  }
}
