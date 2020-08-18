import FakeCurrenciesRepositories from '../../repositories/fakes/FakeCurrenciesRepositories';

class FakeDeleteCurrenciesService {
  public async execute(id: string): Promise<void> {
    const fakeCurrencyRepository = new FakeCurrenciesRepositories();
    const currency = await fakeCurrencyRepository.findCodeById(id);
    if (!currency) {
      throw new Error('Invalid arguments');
    }
    await fakeCurrencyRepository.removeById(id);
  }
}

export default FakeDeleteCurrenciesService;
