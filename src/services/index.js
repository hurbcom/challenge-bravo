import { CurrencyDB } from '../db';
import _CurrencyService from './Currency';

const CurrencyService = new _CurrencyService(CurrencyDB);

export { CurrencyService };