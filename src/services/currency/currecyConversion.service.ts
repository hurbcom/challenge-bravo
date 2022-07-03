import { IcurrecyRequest } from "../../types/currecy";
import { Quote, CoinMarket} from "kencrypto-coin-maker";
import { AppError } from "../../errors/appError";
import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
require('dotenv').config();

const currecyConversionService =async ({from, to, amount}: IcurrecyRequest) =>  {
  from = from.toUpperCase();
  to = to.toUpperCase();

  const key = process.env.KEY_COIN_MARKET;

  if (!key) {
    throw new AppError(401, "Key coin market cannot be null");
  }

  const coin = new CoinMarket(key);

  let result = await coin.conversion(from, Number(amount), [to]);


  if (result.status.error_message) {
    const symbolProperty = result.status.error_message.split('"')[1];
    const symbolValeu = result.status.error_message?.split('"')[3];

    const currency = await AppDataSource
      .getRepository(Currency)
      .createQueryBuilder("currency")
      .where("currency.symbol = :symbol", { symbol: symbolValeu })
      .getOne()

    if (!currency) {
      throw new AppError(404, `Currency ${symbolValeu} not found!`);
    }
    if (symbolProperty === "symbol") {
      result = await coin.conversion("USD", Number(amount), [to]);
      result.data.name = currency.name;
      result.data.symbol = currency.symbol;
      result.data.last_updated = currency.last_updated;
      result.data.id = currency.id;
      result.data.quote[to].price *= currency.price;

    } else {
      result = await coin.conversion(from, Number(amount), ["USD"]);
      const obj: Quote = {};
      obj[to] = {"price": (result.data.quote["USD"].price) / currency.price, "last_updated": currency.last_updated};
      result.data.quote = obj;

    }

  }
  return result["data"];
}

export default currecyConversionService;