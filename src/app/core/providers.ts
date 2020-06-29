import { Container } from 'inversify';
// import glob from "glob";
// import { resolve } from "path";
import ExchangeService from '@services/exchange';
import CoinAPIService from '@services/exchange/CoinAPIService';
import ExchangeController from '@controllers/ExchangeController';
import types from './types';

class Providers {
  container: Container;

  constructor() {
    this.container = new Container();
    this.register();
  }

  register() {
    this.container.bind<ExchangeService>(types.ExchangeService).to(CoinAPIService);
    this.container.bind<ExchangeController>(types.ExchangeController).to(ExchangeController);
  }
}

export default new Providers();