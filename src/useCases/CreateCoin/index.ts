import { MysqlCoinsRepository } from '../../repositories/implementations/MysqlCoinsRepository';
import { CreateCoinController } from './CreateCoinController';
import { CreateCoinUseCase } from './CreateCoinUseCase';

const mysqlCoinsRepository = new MysqlCoinsRepository();

const createCoinUseCase = new CreateCoinUseCase(mysqlCoinsRepository);

const createCoinController = new CreateCoinController(createCoinUseCase);

export { createCoinUseCase, createCoinController };
