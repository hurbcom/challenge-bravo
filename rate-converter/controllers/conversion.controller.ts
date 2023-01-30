// import { getExchangeRate } from '../services/exchangeRate';

// import { ConversionParams } from './conversion.types';

// export async function convert(params: ConversionParams) {
//   const { fromCurrency, toCurrency, amount } = params;
//   const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
//   return exchangeRate * amount;
// }

import { Request, Response } from 'express';
import { getExchangeRate } from '../services/exchangeRate.service';

export const conversionController = async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body;
    const rate = await getExchangeRate(from, to);
    const convertedAmount = amount * rate;

    res.send({
      success: true,
      from,
      to,
      amount,
      convertedAmount
    });
  } catch (error: TypeError | any) {
    res.status(500).send({ success: false, error: error.message });
  }
};