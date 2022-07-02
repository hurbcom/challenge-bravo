import { Request, Response, NextFunction } from 'express' 
import { AppError } from '../errors/appError';
import { CoinMarket } from "./../../../kencrypto-coin-maker/src/index";
require('dotenv').config();

export const currencyAlreadyExist = async(req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.body;

  const key = process.env.KEY_COIN_MARKET;

  if (!key) {
    throw new AppError(401, "Key coin market cannot be null");
  }

  const coinMarket = new CoinMarket(key);
  
  const resultQuery = await coinMarket.quotes([symbol]);

  if (Object.keys(resultQuery.data).length === 0) {
    return next();
  }

  throw new AppError(409, `${symbol} already exist`);
}