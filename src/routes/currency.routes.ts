/* eslint-disable no-shadow */
import { Router, request, response } from 'express';
import { getCustomRepository } from 'typeorm';

import AddCurrenciesService from '../services/AddCurrenciesService';
import CurrenciesRepositories from '../repositories/CurrenciesRepositories';
import DeleteCurrenciesService from '../services/DeleteCurrenciesService';

const currencyRouter = Router();
const addCurrency = new AddCurrenciesService();

currencyRouter.get('/', async (request, response) => {
  const currencyRepository = getCustomRepository(CurrenciesRepositories);
  const currencies = await currencyRepository.find();

  return response.json(currencies);
});

currencyRouter.post('/', async (request, response) => {
  try {
    const { code, name } = request.body;
    const currency = await addCurrency.execute({
      code, name,
    });
    return response.json({ mesage: 'New currency coin created successfully!', currency });
  } catch (err) {
    console.log(err);
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
    const deleteCurrency = new DeleteCurrenciesService();
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

currencyRouter.post('/convert');

export default currencyRouter;
