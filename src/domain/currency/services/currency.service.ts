import { CreateCurrencyDTO } from '../dto/create-currency.dto';
import { Currency } from '../entities/currency.entity';
import { CurrencyRepository } from '../repositories/currency.repository';
import { ExternalCurrencyAPI } from './external-currency-api.service';

export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly externalCurrencyAPI: ExternalCurrencyAPI
  ) {}
  
  async createCurrency(createCurrencyDTO: CreateCurrencyDTO): Promise<Currency> {
    const currency = new Currency(
      createCurrencyDTO.code,
      createCurrencyDTO.unitCost,
      createCurrencyDTO.backingCurrency
    );
    await this.currencyRepository.create(currency);
    return currency;
  }
}


