import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
import { AppError } from "../../errors/appError";
import { IcurrencyUpdate, Icurrency} from "../../types/currecy";


const currencyUpdateService =async (body:IcurrencyUpdate, currency_id: string): Promise<Icurrency> => {

  body["last_updated"] = new Date();
  
  await AppDataSource
    .createQueryBuilder()
    .update(Currency)
    .set(body)
    .where("id = :id", { id: currency_id })
    .execute()

  const currency = await AppDataSource
    .getRepository(Currency)
    .createQueryBuilder("currency")
    .where("currency.id = :id", { id: currency_id })
    .getOne()

  if (!currency) {
    throw new AppError(404, "Currency not found!");
  }

  return currency;
}

export default currencyUpdateService;