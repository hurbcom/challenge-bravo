import { AppError } from "../../../../shared/errors/AppError";
import { IResponseCurrency } from "../../../../shared/infra/services/ExchangeApiService";
import { IExchangeApiService } from "../../../../shared/services/IExchangeApiService";
import { makeExchangeApiService } from "../../../../shared/utils/tests/makeExchangeApiServiceStub";
import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

let createCurrencyUseCase: CreateCurrencyUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;
let exchangeApiServiceStub: IExchangeApiService;

describe("Create currency", () => {
  beforeEach(() => {
    exchangeApiServiceStub = makeExchangeApiService();
    currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
    createCurrencyUseCase = new CreateCurrencyUseCase(
      currenciesRepositoryInMemory,
      exchangeApiServiceStub
    );
  });

  it("should be able to add a new currency", async () => {
    const currencyCode = "TST";
    const newCurrency = await createCurrencyUseCase.execute(currencyCode);

    expect(newCurrency).toHaveProperty("id");
    expect(newCurrency.currencyCode).toBe(currencyCode);
  });

  it("should not be able to add a currency that has already been added", async () => {
    const currencyCode = "TST";
    await createCurrencyUseCase.execute(currencyCode);

    await expect(async () => {
      await createCurrencyUseCase.execute(currencyCode);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to add a currency that does not exist", async () => {
    const currencyCode = "NOT EXIST";

    await expect(async () => {
      jest
        .spyOn(exchangeApiServiceStub, "getCurrency")
        .mockReturnValueOnce(null);

      await createCurrencyUseCase.execute(currencyCode);
    }).rejects.toBeInstanceOf(AppError);
  });
});
