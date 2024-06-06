import CurrencyRateRepository from "../repository/currency-rate-repository";

export class DeleteCurrencyRateByCode {
  constructor(private readonly currencyRateRepository: CurrencyRateRepository) { }

  async execute(code: string): Promise<void> {
    const currencyRate = await this.currencyRateRepository.findByCode(code);
    if (!currencyRate) {
      throw new Error('Currency rate not found');
    }
    await this.currencyRateRepository.delete(currencyRate.id);
  }
}