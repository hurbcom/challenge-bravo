import { CurrencyDB } from '../integrations/database';
import _CurrencyService from './Currency';

const CurrencyService = new _CurrencyService(CurrencyDB);

export { CurrencyService };