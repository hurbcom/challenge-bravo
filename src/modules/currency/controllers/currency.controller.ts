import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CurrencyConversionRequestDTO } from '../resources/currency-conversion/dtos/currency-conversion.dto';
import { CurrencyConversionService } from '../resources/currency-conversion/services/currency-conversion.service';
import { CreateCurrencyService } from '../resources/create-currency/services/create-currency.service';
import { CreateCurrencyRequestDTO } from '../resources/create-currency/dtos/create-currency.dto';
import { DeleteCurrencyService } from '../resources/delete-currency/services/delete-currency.service';
import { DeleteCurrencyRequestDTO } from '../resources/delete-currency/dtos/delete-currency.dto';

export class CurrencyController {
  
  public async currencyConversion(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction): Promise<Response> {
    try {
      const currencyConversionService = container.resolve(CurrencyConversionService);
      const payload = req.query as CurrencyConversionRequestDTO
      const response = await currencyConversionService.execute(payload)
      return res.status(200).send(response)
    } catch (error) {
      next(error)
    }
  }

  public async createCurrency(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction): Promise<Response> {
    try {
      const createCurrencyService = container.resolve(CreateCurrencyService);
      const payload = req.body as CreateCurrencyRequestDTO
      const response = await createCurrencyService.execute(payload)
      return res.status(201).send(response)
    } catch (error) {
      next(error)
    }
  }

  public async deleteCurrency(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction): Promise<Response> {
    try {
      const deleteCurrencyService = container.resolve(DeleteCurrencyService);
      const payload = req.query as DeleteCurrencyRequestDTO
      const response = await deleteCurrencyService.execute(payload.code)
      return res.status(204).send(response)
    } catch (error) {
      next(error)
    }
  }
}