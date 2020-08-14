/* eslint-disable no-shadow */
import { Router, request, response } from 'express';
import { getCustomRepository } from 'typeorm';

import AddCurrenciesService from '../services/AddCurrenciesService';
import CurrenciesRepositories from '../repositories/CurrenciesRepositories';
import DeleteCurrenciesService from '../services/DeleteCurrenciesService';
import ExchangeCurrencyService from '../services/ExchangeCurrenciesService';
import AddCurrenciesValidation from '../middlewares/add_currency/AddCurrencyValidation';
import DeleteValidation from '../middlewares/delete_currency/DeleteCurrencyValidations';
import ExchangeValidation from '../middlewares/exchange_currrencies/ExchangeCurrencyValidations';

const currencyRouter = Router();
const addCurrency = new AddCurrenciesService();
const exchangeCurrencies = new ExchangeCurrencyService();
const deleteCurrency = new DeleteCurrenciesService();
const currencyValidation = new AddCurrenciesValidation();
const deleteValidation = new DeleteValidation();
const exchangeValidation = new ExchangeValidation();

currencyRouter.get('/', async (request, response) => {
  const currencyRepository = getCustomRepository(CurrenciesRepositories);
  const currencies = await currencyRepository.find();

  return response.json(currencies);
});

currencyRouter.post('/', async (request, response) => {
  try {
    const { code, name } = request.body;
    await currencyValidation.validateCurrency({ code, name });
    const currency = await addCurrency.execute({
      code, name,
    });
    return response.json({ mesage: 'New currency coin created successfully!', currency });
  } catch (err) {
    return response.status(400).json(
      {
        message: 'Invalid entries. Make sure the code you entering is 3 letter long and does not exist in the list of available currencies',
        error: err.mesage,
      },
    );
  }
});

currencyRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    await deleteValidation.validateId({ id });
    await deleteCurrency.execute(id);
    return response.status(204).json({ mesage: 'Currency coin deleletd successfully' });
  } catch (err) {
    return response.status(400).json(
      {
        message: 'Invalid entries',
        error: err.mesage,
      },

    );
  }
});

currencyRouter.post('/convert', async (request, response) => {
  try {
    const { to, from, amount } = request.body;
    await exchangeValidation.validateExchange({ to, from, amount });
    const convert = await exchangeCurrencies.execute({ to, from, amount });
    return response.json({ mesage: 'Currency converted successfully', convert });
  } catch (err) {
    return response.status(400).json(
      {
        message: 'Invalid entries',
        error: err.mesage,
      },

    );
  }
});

export default currencyRouter;
