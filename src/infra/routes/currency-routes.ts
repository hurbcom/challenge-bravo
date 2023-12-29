import { Router } from "express";
import ShowTopTenCurrency from "../../domain/use-cases/show-top-ten-currency.use-case";
import ShowCurrencyUseCase from "../../domain/use-cases/show-currency-history.use-case";
import CurrencyController from "../controllers/currency.controller";
import { Connection } from "mongoose";
import CurrencyRepositoryImpl from "../data/repositories/currency.respository.impl";
import UpdateCurrencyUseCase from "../../domain/use-cases/update-currency.use-case";
import RegisterNewCurrencyCurrencyCase from "../../domain/use-cases/register-new-currency.use-case";
import ShowCurrencyHistoryUseCase from "../../domain/use-cases/show-currency-history.use-case";


const currencyRoutes = (router: Router, connection: Connection) => {
  const CURRENCY_API_PREFIX = '/currencies';

  const currencyRepository = new CurrencyRepositoryImpl(connection);
  const updateCurrencyUseCase = new UpdateCurrencyUseCase(currencyRepository)
  const registerNewCurrency = new RegisterNewCurrencyCurrencyCase(currencyRepository);
  const showCurrency = new ShowCurrencyUseCase();
  const showTopTenCurrency = new ShowTopTenCurrency();
  const showCurrencyHistoryUseCase = new ShowCurrencyHistoryUseCase();
  const currencyController = new CurrencyController(registerNewCurrency, updateCurrencyUseCase, showCurrency, showTopTenCurrency, showCurrencyHistoryUseCase);    

  router.post(`${CURRENCY_API_PREFIX}/currency`, (request, response) =>
      currencyController.postCurrency(request, response)
  );

  router.put(`${CURRENCY_API_PREFIX}/currency`, (request, response) =>
      currencyController.updateCurrency(request, response)
  );
  
  router.get(`${CURRENCY_API_PREFIX}/currency`, (request, response) =>
      currencyController.getOneCurrency(request, response)
  );


  router.get(`${CURRENCY_API_PREFIX}/all`, (request, response) =>
    currencyController.getAllCurrency(request, response)
  );

  router.get(`${CURRENCY_API_PREFIX}/api/currency`, (request, response) =>
    currencyController.getApiCurrency(request, response)
  );

  router.get(`${CURRENCY_API_PREFIX}/api`, (request, response) =>
  currencyController.getAllApiCurrency(request, response)
  );
  
};

export default currencyRoutes;
