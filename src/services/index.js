import { CurrencyDB } from '../integrations/database';
import { CurrencyQuoteAPI } from '../integrations/gateways';
import Cache from '../libs/Cache';
import _CurrencyService from './Currency';

const CurrencyService = new _CurrencyService(CurrencyDB, CurrencyQuoteAPI, Cache);

export { CurrencyService };