import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
import { Icurrency } from "../../types/currecy";


const currencyListService =async (): Promise<Icurrency[]> => {
  const currencies = await AppDataSource
    .getRepository(Currency)
    .createQueryBuilder("currency")
    .getMany()

  return currencies;
}

export default currencyListService;