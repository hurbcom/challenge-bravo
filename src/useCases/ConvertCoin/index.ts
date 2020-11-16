import { ConversionProvider } from '../../providers/implementations/ConversionProvider';
import { MysqlCoinsRepository } from '../../repositories/implementations/MysqlCoinsRepository';
import { ConvertCoinController } from './ConvertCoinController';
import { ConvertCoinUseCase } from './ConvertCoinUseCase';

const conversionProvider = new ConversionProvider();
const mysqlCoinsRepository = new MysqlCoinsRepository();

const convertCoinUseCase = new ConvertCoinUseCase(
  conversionProvider,
  mysqlCoinsRepository
);

const convertCoinController = new ConvertCoinController(convertCoinUseCase);

export { convertCoinUseCase, convertCoinController };
