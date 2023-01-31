import { Request, Response } from 'express';
import { getExchangeRate } from '../services/exchangeRate.service';
import { RequestQuery, RequestParams, RequestBody, ResponseBody } from './conversion.types';


const currencyCodeFormat = /^[A-Z]{3,5}$/;

export const conversionController = async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
    ) => {
  try {
    const { from, to, amount } = req.query;

    // Check if the currency codes are valid
    if (!currencyCodeFormat.test(from) || !currencyCodeFormat.test(to)) {
        res.status(400).send({ success: false, error: 'Invalid currency code format' });
        return;
      }

    // Amount should be a number
    if (isNaN(Number(amount))) {
        res.status(400).send({ success: false, error: 'Invalid amount' });
        return;
      }



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