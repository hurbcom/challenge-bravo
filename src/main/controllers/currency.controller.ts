import { Request, Response } from 'express';
import { CurrencyService } from '../../domain/currency/services/currency.service';

export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  async createCurrency(req: Request, res: Response) {
    const currency = await this.currencyService.createCurrency({
      code: req.body.code,
      unitCost: req.body.unitCost,
      backingCurrency: req.body.backingCurrency
    });

    return res.status(201).json(currency);
  }
  async convertCurrency(req: Request, res: Response) {
    const {from, to, amount} = req.query;
    if(!from || !to || !amount) return res.status(400).json({message: 'Missing arguments'});
    const value = await this.currencyService.convertCurrency(String(from), String(to), String(amount));
    return res.status(200).json(value);
  }
  deleteCurrency(req: Request, res: Response) {
    return {'Hello': 'World'};
  }
}
