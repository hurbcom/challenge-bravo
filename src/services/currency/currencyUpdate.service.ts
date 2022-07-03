import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
import { AppError } from "../../errors/appError";
import { IcurrencyUpdate, Icurrency } from "../../types/currecy";


const currencyUpdateService =async (body:IcurrencyUpdate, currency_id: string): Promise<any> => {

  const result = await AppDataSource
    .createQueryBuilder()
    .update(Currency)
    .set(body)
    .where("id = :id", { id: currency_id })
    .execute()

  if (result["affected"] === 0) {
    throw new AppError(404, "Currency not found!")
  }

  return "result"
}

export default currencyUpdateService;