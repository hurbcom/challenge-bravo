import { Container } from 'inversify';
import { Server } from './server';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyService } from './services/currency.service';
import { CurrencyRepository } from './repositories/currency.repository';
import { ExchangeController } from './controllers/exchange.controller';
import { ExchangeService } from './services/exchange.service';
import { FreeCurrencyApiService } from './services/free-currency-api.service';
import { CurrencyFactory } from './infrastructure/factories/currency.factory';

// DI Container for IoC using Inversify

const DIContainer = new Container();

DIContainer.bind<Server>(Server).toSelf();

DIContainer.bind<CurrencyController>(CurrencyController).toSelf().inRequestScope();
DIContainer.bind<CurrencyService>(CurrencyService).toSelf().inRequestScope();
DIContainer.bind<CurrencyRepository>(CurrencyRepository).toSelf().inSingletonScope();
DIContainer.bind<CurrencyFactory>(CurrencyFactory).toSelf().inRequestScope();

DIContainer.bind<ExchangeController>(ExchangeController).toSelf().inRequestScope();
DIContainer.bind<ExchangeService>(ExchangeService).toSelf().inRequestScope();

DIContainer.bind<FreeCurrencyApiService>(FreeCurrencyApiService).toSelf().inRequestScope();

export default DIContainer;