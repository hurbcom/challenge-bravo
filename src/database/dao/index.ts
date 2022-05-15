import { currencyMapper } from '../../mappers';
import { CurrencyDao } from './currency.dao';

const currencyDao = new CurrencyDao(currencyMapper);

export { currencyDao };
