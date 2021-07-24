import { container } from 'tsyringe';

import { CurrenciesRepository } from '@infra/databases/mongoose/repositories/CurrenciesRepository';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

// Providers
import './providers/CurrencyConverterProvider';

// Repositories
container.registerSingleton<ICurrenciesRepository>(
  'CurrenciesRepository',
  CurrenciesRepository,
);
