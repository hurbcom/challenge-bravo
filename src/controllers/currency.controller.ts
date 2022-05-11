import { Request, Response } from 'express';
import Joi from 'joi';
import { ICurrencyService } from '../interfaces/currency-service';
import {
  CurrencyAdded,
  CurrencyExchanged,
  CurrencyDeleted,
  CurrencyNotFound,
  FictitiousCurrencyAlreadyRegistered,
  InvalidFictitiousCurrencyCode,
  RealCurrencyAlreadyRegistered,
  RealCurrencyNotSupported,
} from '../services/responses/currency-service.response';
import { HttpStatus } from '../web/http-status';
import { BaseController } from './base.controller';

const inputRealCurrencySchema = Joi.string().length(3).uppercase().required();

const inputFictitiousCurrencySchema = Joi.object({
  currency: Joi.string().min(3).max(5).uppercase().required(),
  exchangeRate: Joi.string().regex(new RegExp('^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$')).required(),
});
const inputDeleteCurrencySchema = Joi.string().min(3).max(5).uppercase().required();

const inputExchangeCurrencySchema = Joi.object({
  from: Joi.string().min(3).max(5).uppercase().required(),
  to: Joi.string().min(3).max(5).uppercase().required(),
  amount: Joi.string().regex(new RegExp('^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$')).required(),
});

export class CurrencyController extends BaseController {
  protected serviceResponseMap: Map<string, HttpStatus>;

  constructor(private readonly currencyService: ICurrencyService) {
    super();
    this.serviceResponseMap = new Map<string, HttpStatus>([
      [RealCurrencyNotSupported.name, HttpStatus.BAD_REQUEST],
      [RealCurrencyAlreadyRegistered.name, HttpStatus.BAD_REQUEST],
      [CurrencyAdded.name, HttpStatus.CREATED],
      [InvalidFictitiousCurrencyCode.name, HttpStatus.BAD_REQUEST],
      [FictitiousCurrencyAlreadyRegistered.name, HttpStatus.BAD_REQUEST],
      [CurrencyDeleted.name, HttpStatus.OK],
      [CurrencyNotFound.name, HttpStatus.BAD_REQUEST],
      [CurrencyExchanged.name, HttpStatus.OK],
    ]);
  }

  public async addRealCurrency(req: Request, res: Response) {
    const currency = req.query.currency as string;

    try {
      await inputRealCurrencySchema.validateAsync(currency);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e.message);
      return;
    }

    try {
      const result = await this.currencyService.addRealCurrency(currency);
      const httpStatus = this.getHttpStatus(result);
      res.status(httpStatus).json(result);
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
      const httpStatus = this.getHttpStatus(result);
      res.status(httpStatus).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while adding fictitious currency.');
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
      const httpStatus = this.getHttpStatus(result);
      res.status(httpStatus).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while deleting currency.');
    }
  }

  public async exchangeCurrency(req: Request, res: Response) {
    const exchangeInput = req.query;

    try {
      await inputExchangeCurrencySchema.validateAsync(exchangeInput);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e.message);
      return;
    }

    try {
      const from = exchangeInput.from as string;
      const to = exchangeInput.to as string;
      const amount = exchangeInput.amount as string;
      const result = await this.currencyService.exchangeCurrencies(from, to, amount);
      const httpStatus = this.getHttpStatus(result);
      res.status(httpStatus).json(result);
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal error occourred while exchanging currencies.');
    }
  }
}
