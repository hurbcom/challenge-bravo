import { Controller } from './controller';
import { HttpServer } from './http-server';

export class CurrenciesRoutes {
  private readonly listCurrenciesController?: Controller;
  private readonly createCurrencyController: Controller;
  private readonly convertCurrencyController: Controller;
  private readonly getCurrencyByCodeController: Controller;
  private readonly deleteCurrencyController: Controller;

  constructor(dependencies: Controllers) {
    this.listCurrenciesController = dependencies.listCurrenciesController;
    this.createCurrencyController = dependencies.createCurrencyController;
    this.convertCurrencyController = dependencies.convertCurrencyController;
    this.getCurrencyByCodeController = dependencies.getCurrencyByCodeController;
    this.deleteCurrencyController = dependencies.deleteCurrencyController;
  }

  registerRoutes(httpServer: HttpServer) {
    if (this.listCurrenciesController) {
      httpServer.register(
        'get',
        '/api/v1/currencies',
        this.listCurrenciesController
      );
    }
    httpServer.register(
      'post',
      '/api/v1/currencies',
      this.createCurrencyController
    );
    httpServer.register(
      'get',
      '/api/v1/currencies/convert',
      this.convertCurrencyController
    );
    httpServer.register(
      'get',
      '/api/v1/currencies/{code}',
      this.getCurrencyByCodeController
    );
    httpServer.register(
      'delete',
      '/api/v1/currencies/{code}',
      this.deleteCurrencyController
    );
  }
}

type Controllers = {
  listCurrenciesController?: Controller;
  createCurrencyController: Controller;
  convertCurrencyController: Controller;
  getCurrencyByCodeController: Controller;
  deleteCurrencyController: Controller;
};
