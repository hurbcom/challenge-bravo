import { CurrencyDB } from '../integrations/database';
import { CurrencyQuoteAPI } from '../integrations/gateways';
import _CurrencyService from './Currency';

const CurrencyService = new _CurrencyService(CurrencyDB, CurrencyQuoteAPI);

export { CurrencyService };