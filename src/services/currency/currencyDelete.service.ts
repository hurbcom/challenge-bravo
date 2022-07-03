import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
import { AppError } from "../../errors/appError";

const currencyDeleteService =async (currency_id: string): Promise<null> => {
  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Currency)
    .where("id = :id", {id: currency_id})
    .execute()
  
  if (result["affected"] === 0) {
    throw new AppError(404, "Currency id not found!");
  }
  
  return null;
}

export default currencyDeleteService;