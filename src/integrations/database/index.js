import Database from '../../libs/Database';
import Cache from '../../libs/Cache';
import CurrencyMapper from '../../mappers/Currency';
import _CurrencyDB from './Currency';

const CurrencyDB = new _CurrencyDB(Database, CurrencyMapper, Cache);

export { CurrencyDB };