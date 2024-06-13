import { CurrencyRateRepository } from '@/application/repository';

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
      throw new Error('Currency rate not found');
    }
    await this.currencyRateRepository.delete(currencyRate.code);
  }
}

export default DeleteCurrencyRateByCode;
