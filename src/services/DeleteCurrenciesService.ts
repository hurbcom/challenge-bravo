import { getCustomRepository } from 'typeorm';

import CurrenciesRepositories from '../repositories/CurrenciesRepositories';

class DeleteCurrenciesService {
  public async execute(id: string): Promise<void> {
    const currencyRepository = getCustomRepository(CurrenciesRepositories);
    const currency = await currencyRepository.findOne(id);
    if (!currency) {
      throw new Error('Invalid arguments');
    }
    await currencyRepository.remove(currency);
  }
}

export default DeleteCurrenciesService;
