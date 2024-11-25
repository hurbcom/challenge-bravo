import { CurrencyRepositoryFactory } from '../../repositories/factories';
import { CurrencyService } from '../../services/CurrencyService';
import { CurrencyController as ICurrencyController } from '../../types';
import { CurrencyController } from '../CurrencyController';

export class CurrencyControllerFactory {
  private static instance: CurrencyController | null = null;

  static create(): ICurrencyController {
    if (!this.instance) {
      const fiatRepository = CurrencyRepositoryFactory.getRepository('fiat');
      const cryptoRepository = CurrencyRepositoryFactory.getRepository('crypto');
      const currencyService = new CurrencyService(fiatRepository, cryptoRepository);

      this.instance = new CurrencyController(currencyService);
    }

    return this.instance;
  }

  // For testing purposes - allows resetting the singleton instance
  static reset(): void {
    this.instance = null;
  }
}
