import { CurrencyController } from './currency.controller';
import { currencyService } from '../services';

const currencyController = new CurrencyController(currencyService);

export { currencyController };
