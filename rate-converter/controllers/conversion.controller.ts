import { Request, Response } from 'express';
import { getExchangeRate } from '../services/exchangeRate.service';
import { RequestQuery, RequestParams, RequestBody, ResponseBody } from './conversion.types';

export const conversionController = async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
    ) => {
  try {
    const { from, to, amount } = req.query;
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