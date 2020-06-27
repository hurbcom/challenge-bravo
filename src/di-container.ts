import { Container } from 'inversify';
import { Server } from './server';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyService } from './services/currency.service';
import { CurrencyRepository } from './repositories/currency.repository';

const DIContainer = new Container();

DIContainer.bind<Server>(Server).toSelf();
DIContainer.bind<CurrencyController>(CurrencyController).toSelf().inRequestScope();
DIContainer.bind<CurrencyService>(CurrencyService).toSelf().inRequestScope();
DIContainer.bind<CurrencyRepository>(CurrencyRepository).toSelf().inSingletonScope();

export default DIContainer;