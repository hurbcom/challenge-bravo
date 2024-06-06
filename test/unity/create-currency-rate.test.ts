import CreateCurrencyRate, { CreateCurrencyRateDto } from "@/application/use-case/create-currency-rate";
import GetCurrencyRateByCode from "@/application/use-case/get-currency-rate-by-code";
import CurrencyRateRepositoryFake from "@/infra/repository/currency-rate-repository-fake";

describe('create-currency-rate', () => {
  it('should create a currency', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput = {
      name: "Grand Theft Auto Dollar",
      symbol: "GTA$",
      code: "GTA",
      decimalPoints: 2,
      baseAmount: 1250000.00,
      equivalentCurrencyCode: "BRL",
      equivalentCurrencyAmount: 83.50,
    }
    await createCurrency.execute(createCurrencyInput);
    const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository);
    const getCurrencyOutput = await getCurrencyRateByCode.execute(createCurrencyInput.code);
    expect(getCurrencyOutput.name).toBe(createCurrencyInput.name);
    expect(getCurrencyOutput.symbol).toBe(createCurrencyInput.symbol);
    expect(getCurrencyOutput.code).toBe(createCurrencyInput.code);
    expect(getCurrencyOutput.decimalPoints).toBe(createCurrencyInput.decimalPoints);
    expect(getCurrencyOutput.rate).toBe(77844.31137724551);
  });

  it('should not create a currency with duplicated code', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput: CreateCurrencyRateDto = {
      name: 'Any Currency',
      code: 'ANY',
      symbol: 'A$',
      decimalPoints: 2,
      baseAmount: 1.00,
      equivalentCurrencyCode: "USD",
      equivalentCurrencyAmount: 1.00,
    }
    await createCurrency.execute(createCurrencyInput);
    await expect(createCurrency.execute(createCurrencyInput)).rejects.toThrow('Currency rate with code ANY already exists');
  });

  it('should not create a currency with invalid attribute', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput: CreateCurrencyRateDto = {
      name: 'Any Currency',
      code: 'ANY',
      symbol: 'A$',
      decimalPoints: 2,
      baseAmount: -1.00,
      equivalentCurrencyCode: "USD",
      equivalentCurrencyAmount: 1.00,
    }
    await expect(createCurrency.execute(createCurrencyInput)).rejects.toThrow('Invalid attribute: baseAmount');
    createCurrencyInput.baseAmount = 1.00;
    createCurrencyInput.equivalentCurrencyAmount = -1.00;
    await expect(createCurrency.execute(createCurrencyInput)).rejects.toThrow('Invalid attribute: equivalentCurrencyAmount');
  });

});