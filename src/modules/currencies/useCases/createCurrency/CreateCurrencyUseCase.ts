import { injectable, inject } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IExchangeApiService } from "../../../../shared/services/IExchangeApiService";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

@injectable()
class CreateCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository,
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

    const currencyResult = await this.exchangeApiSerice.getCurrency(
      currencyCode
    );

    if (!currencyResult) {
      throw new AppError(
        "This currency does not exists! If you wanna create a new fictional currency, check the documentation to get the right endpoint."
      );
    }

    const newCurrency = await this.currenciesRepository.addCurrency({
      currencyCode,
      currencyName: currencyResult.name,
      isFictional: false,
      priceUsd: currencyResult.price_usd,
    });

    return newCurrency;
  }
}

export { CreateCurrencyUseCase };
