import { MysqlCoinsRepository } from '../../repositories/implementations/MysqlCoinsRepository';
import { UpdateCoinController } from './UpdateCoinController';
import { UpdateCoinUseCase } from './UpdateCoinUseCase';

const mysqlCoinsRepository = new MysqlCoinsRepository();

const updateCoinUseCase = new UpdateCoinUseCase(mysqlCoinsRepository);

const updateCoinController = new UpdateCoinController(updateCoinUseCase);

export { updateCoinUseCase, updateCoinController };
