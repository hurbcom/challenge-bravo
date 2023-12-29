import CurrencyEntity, { CurrencyEntityProps } from '../entities/currency.entity';
import CurrencyRepository from '../repositories/currency.repository';

export default class LoginCurrencyUseCase {
  constructor(private readonly currencyRepository: CurrencyRepository) { }

  async execute(currencyEntityProps: CurrencyEntityProps): Promise<CurrencyEntity | null> {
    try {
      const currencyResponse = await this.currencyRepository.findBy({
        code: currencyEntityProps.code,
      });

      return currencyResponse? currencyResponse[0] : null

    } catch (e) {
      return null
    }
  }
}
