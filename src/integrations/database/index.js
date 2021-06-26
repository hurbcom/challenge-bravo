import Database from '../../libs/Database';
import _CurrencyDB from './Currency';
import CurrencyMapper from '../../mappers/Currency';

const CurrencyDB = new _CurrencyDB(Database, CurrencyMapper);

export { CurrencyDB };