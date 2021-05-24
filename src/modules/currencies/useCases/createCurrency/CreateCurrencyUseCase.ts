import { injectable, inject } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICacheService } from "../../../../shared/services/ICacheService";
import { IExchangeApiService } from "../../../../shared/services/IExchangeApiService";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

@injectable()
class CreateCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository,
    @inject("CacheService")
    private cacheService: ICacheService,
    @inject("ExchangeApiService")
    private exchangeApiSerice: IExchangeApiService
  ) {}

  async execute(currencyCode: string): Promise<Currency> {
    const currency = await this.currenciesRepository.getCurrencyByCode(
      currencyCode
    );

    if (currency) {
      throw new AppError("Currency already exists");
    }

    const currencyName = await this.cacheService.getCurrencyNameByCode(
      currencyCode
    );

    const priceUsd = await this.exchangeApiSerice.getCurrencyUsdPrice(
      currencyCode
    );

    const newCurrency = await this.currenciesRepository.addCurrency({
      currencyCode,
      currencyName,
      isFictional: false,
      priceUsd,
    });

    return newCurrency;
  }
}

export { CreateCurrencyUseCase };
