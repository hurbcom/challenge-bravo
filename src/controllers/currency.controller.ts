import { Request, Response } from 'express';
import Joi from 'joi';
import { CurrencyService } from '../services/currency.service';
import { HttpStatus } from '../web/http-status';

const inputRealCurrencySchema = Joi.string().length(3).uppercase().required();
const inputFictitiousCurrencySchema = Joi.object({
  currency: Joi.string().min(3).max(5).uppercase().required(),
  exchangeRate: Joi.string().regex(new RegExp('^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$')).required(),
});
const inputDeleteCurrencySchema = Joi.string().min(3).max(5).uppercase().required();

export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  public async addRealCurrency(req: Request, res: Response) {
    const { currency } = req.query;

    try {
      await inputRealCurrencySchema.validateAsync(currency);
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

  public async addFictitiousCurrency(req: Request, res: Response) {
    const currencyInput = req.query;

    try {
      await inputFictitiousCurrencySchema.validateAsync(currencyInput);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e.message);
      return;
    }

    try {
      const result = await this.currencyService.addFictitiousCurrency(currencyInput);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while adding real currency.');
    }
  }

  public async deleteCurrency(req: Request, res: Response) {
    const { currency } = req.query;

    try {
      await inputDeleteCurrencySchema.validateAsync(currency);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e.message);
      return;
    }

    try {
      const result = await this.currencyService.deleteCurrency(currency);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while adding real currency.');
    }
  }
}
