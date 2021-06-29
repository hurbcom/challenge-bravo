import CurrencyMapper from '../../mappers/Currency';
import _CurrencyQuoteAPI from './CurrencyQuoteAPI';

const CurrencyQuoteAPI = new _CurrencyQuoteAPI(CurrencyMapper);

export { CurrencyQuoteAPI };