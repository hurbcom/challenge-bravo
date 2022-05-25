import { ICreateCurrencyDTO } from "../dtos/ICreateCurrencyDTO";
import { Currency } from "../infra/typeorm/entities/Currency";

interface ICurrenciesRepository {
  create(name: ICreateCurrencyDTO): Promise<Currency>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Currency>;
}

export { ICurrenciesRepository };
