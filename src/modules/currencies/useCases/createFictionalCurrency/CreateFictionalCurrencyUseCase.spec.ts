import { AppError } from "../../../../shared/errors/AppError";
import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import {
  CreateFictionalCurrencyUseCase,
  ICreateFictionalCurrencyRequest,
} from "./CreateFictionalCurrencyUseCase";

let createFictionalCurrencyUseCase: CreateFictionalCurrencyUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;
let createFictionalCurrencyRequest: ICreateFictionalCurrencyRequest;

describe("Create currency", () => {
  beforeEach(() => {
    currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
    createFictionalCurrencyUseCase = new CreateFictionalCurrencyUseCase(
      currenciesRepositoryInMemory
    );

    createFictionalCurrencyRequest = {
      currencyCode: "HURB",
      currencyName: "Hotel Urbano",
      priceUsd: 5,
    };
  });

  it("should be able to add a new currency", async () => {
    const newCurrency = await createFictionalCurrencyUseCase.execute(
      createFictionalCurrencyRequest
    );

    expect(newCurrency).toHaveProperty("id");
    expect(newCurrency.isFictional).toBe(true);
    expect(newCurrency.currencyCode).toBe(
      createFictionalCurrencyRequest.currencyCode
    );
    expect(newCurrency.currencyName).toBe(
      createFictionalCurrencyRequest.currencyName
    );
  });

  it("should not be able to add a currency that has already been added", async () => {
    await createFictionalCurrencyUseCase.execute(
      createFictionalCurrencyRequest
    );

    await expect(async () => {
      await createFictionalCurrencyUseCase.execute(
        createFictionalCurrencyRequest
      );
    }).rejects.toBeInstanceOf(AppError);
  });
});
