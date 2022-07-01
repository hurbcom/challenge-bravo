import { IcurrecyRequest } from "../../types/currecy";
import { CoinMarket } from "kencrypto-coin-maker";
import { AppError } from "../../errors/appError";
require('dotenv').config();

const currecyConversionService =async ({from, to, amount}: IcurrecyRequest) =>  {
  const key = process.env.KEY_COIN_MARKET;

  if (!key) {
    throw new AppError(401, "Key coin market cannot be null")
  }

  const coin = new CoinMarket(key);
  
  const result = await coin.conversion(from, Number(amount), [to]);

  if (result.status.error_message) {
    throw new AppError(result.status.error_code, result.status.error_message);
  }

  return result;
}

export default currecyConversionService;