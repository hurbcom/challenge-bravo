import { Request, Response } from 'express';
import Joi from 'joi';
import { CurrencyService } from '../services/currency.service';
import { HttpStatus } from '../web/http-status';

const inputSchema = Joi.string().length(3).uppercase().required();

export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  public async addRealCurrency(req: Request, res: Response) {
    // add validations
    const { currency } = req.query;

    try {
      await inputSchema.validateAsync(currency);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e.message);
      return;
    }

    try {
      const result = await this.currencyService.addRealCurrency(currency);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while adding real currency.');
    }
  }
}
