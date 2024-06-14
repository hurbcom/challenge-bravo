import { CurrencyRateRepository } from '@/application/repository';
import { CurrencyNotFoundError } from '@/domain/errors';

export class DeleteCurrencyRateByCode {
  constructor(
    private readonly currencyRateRepository: CurrencyRateRepository
  ) {}

  async execute(code: string): Promise<void> {
    if (code === 'USD') {
      throw new Error('Cannot delete USD currency rate');
    }
    const currencyRate = await this.currencyRateRepository.findByCode(code);
    if (!currencyRate) {
      throw new CurrencyNotFoundError(code);
    }
    await this.currencyRateRepository.delete(currencyRate.code);
  }
}

export default DeleteCurrencyRateByCode;
