import { MysqlCoinsRepository } from '../../repositories/implementations/MysqlCoinsRepository';
import { DeleteCoinController } from './DeleteCoinController';
import { DeleteCoinUseCase } from './DeleteCoinUseCase';

const mysqlCoinsRepository = new MysqlCoinsRepository();

const deleteCoinUseCase = new DeleteCoinUseCase(mysqlCoinsRepository);

const deleteCoinController = new DeleteCoinController(deleteCoinUseCase);

export { deleteCoinUseCase, deleteCoinController };
