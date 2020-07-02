import { Container } from 'inversify';
import ExchangeService from '@services/exchange';
import CoinAPIService from '@services/exchange/CoinAPIService';
import ExchangeController from '@controllers/ExchangeController';
import types from './types';
import CurrencyService from '@services/contracts/CurrencyService';
import HurbCurrencyService from '@services/HurbCurrencyService';
import CurrencyController from '@controllers/CurrencyController';

class Providers {
  container: Container;

  constructor() {
    this.container = new Container();
    this.register();
  }

  register() {
    this.container.bind<ExchangeService>(types.ExchangeService).to(CoinAPIService);
    this.container.bind<ExchangeController>(types.ExchangeController).to(ExchangeController);
    this.container.bind<CurrencyService>(types.CurrencyService).to(HurbCurrencyService);
    this.container.bind<CurrencyController>(types.CurrencyController).to(CurrencyController);
  }
}

export default new Providers();