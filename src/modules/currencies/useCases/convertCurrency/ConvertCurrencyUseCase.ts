import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IExchangeApiService } from "../../../../shared/services/IExchangeApiService";
import { getTomorrowDate } from "../../../../shared/utils/dateOperation";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

interface IConvertCurrencyRequest {
  from: string;
  to: string;
  amount: number;
}

interface IConvertCurrencyResponse {
  descripition: string;
  value: number;
}

@injectable()
class ConvertCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository,
    @inject("ExchangeApiService")
    private exchangeApiService: IExchangeApiService
  ) {}

  async execute({
    from,
    to,
    amount,
  }: IConvertCurrencyRequest): Promise<IConvertCurrencyResponse> {
    const fromCurrency = await this.currenciesRepository.getCurrencyByCode(
      from
    );

    if (!fromCurrency) {
      throw new AppError(`${from} does not exists!`);
    }

    const toCurrency = await this.currenciesRepository.getCurrencyByCode(to);

    if (!toCurrency) {
      throw new AppError(`${to} does not exists!`);
    }

    await this.updateCurrencyIfExpired(fromCurrency);
    await this.updateCurrencyIfExpired(toCurrency);

    const value = (toCurrency.priceUsd / fromCurrency.priceUsd) * amount;
    const valueRounded = Number(value.toFixed(2));

    return {
      descripition: `${amount} ${fromCurrency.currencyName} em ${toCurrency.currencyName}`,
      value: valueRounded === 0 ? value : valueRounded,
    };
  }

  private async updateCurrencyIfExpired(currency: Currency) {
    const today = dayjs();
    const diff = today.diff(currency.expireAt);

    // se a diferença em ms for positiva, significa que já passou da data de expiraçao
    if (diff >= 0) {
      const newPrice = await this.exchangeApiService.getCurrencyUsdPrice(
        currency.currencyCode
      );

      currency.priceUsd = newPrice;
      currency.expireAt = getTomorrowDate();
      await this.currenciesRepository.addCurrency(currency);
    }
  }
}

export { ConvertCurrencyUseCase };
