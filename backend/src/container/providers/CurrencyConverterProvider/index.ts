import { container } from 'tsyringe';

import { PuppeteerProvider } from './implementations/PuppeteerProvider';
import { ICurrencyConverterProvider } from './models/ICurrencyConverterProvider';

container.registerSingleton<ICurrencyConverterProvider>(
  'CurrencyConverterProvider',
  PuppeteerProvider,
);
