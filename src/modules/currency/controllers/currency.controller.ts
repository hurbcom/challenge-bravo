import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CurrencyConversionRequestDTO } from '../dtos/currency-conversion.dto';
import { CurrencyConversionService } from '../services/currency-conversion.service';

export class CurrencyController {
  public async convertCurrency(req: Request<{}, {}, {}, {}>, res: Response): Promise<Response> {
    try {
      const currencyConversionService = container.resolve(CurrencyConversionService);
      const payload = req.query as CurrencyConversionRequestDTO
      const response = await currencyConversionService.execute(payload)
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send({
        message: 'Was not possible to execute your request',
        error: error
      })
    }
  }
}