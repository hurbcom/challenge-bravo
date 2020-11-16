import { MysqlCoinsRepository } from '../../repositories/implementations/MysqlCoinsRepository';
import { GetCoinsController } from './GetCoinsController';
import { GetCoinsUseCase } from './GetCoinsUseCase';

const mysqlCoinsRepository = new MysqlCoinsRepository();

const getCoinsUseCase = new GetCoinsUseCase(mysqlCoinsRepository);

const getCoinsController = new GetCoinsController(getCoinsUseCase);

export { getCoinsUseCase, getCoinsController };
