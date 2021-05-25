import { ICreateCurrencyDTO } from "../dtos/ICreateCurrencyDTO";
import { Currency } from "../infra/typeorm/entities/Currency";

interface ICurrenciesRepository {
  getAll(): Promise<Currency[]>;
  addCurrency(newCurrencyDTO: ICreateCurrencyDTO): Promise<Currency>;
  getCurrencyByCode(currencyCode: string): Promise<Currency>;
  deleteCurrency(id: string): Promise<void>;
}

export { ICurrenciesRepository };
