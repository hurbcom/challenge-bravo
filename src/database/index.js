import Database from '../libs/Database';
import _CurrencyDB from './Currency';

const CurrencyDB = new _CurrencyDB(Database);

export { CurrencyDB };