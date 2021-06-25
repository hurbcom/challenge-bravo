import { CurrencyService } from '../../services';
import _CurrencyController from './Currency';
import _CurrencyConversionController from './CurrencyConversion';

const CurrencyController = new _CurrencyController(CurrencyService);
const CurrencyConversionController = new _CurrencyConversionController(CurrencyService);

export { CurrencyController, CurrencyConversionController };