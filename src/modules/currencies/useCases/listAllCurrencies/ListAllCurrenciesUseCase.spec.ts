import { ICreateCurrencyDTO } from "../../dtos/ICreateCurrencyDTO";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import { ListAllCurrenciesUseCase } from "./ListAllCurrenciesUseCase";

let listAllCurrenciesUseCase: ListAllCurrenciesUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;
let currencyDTO: ICreateCurrencyDTO;

describe("Create currency", () => {
  beforeEach(() => {
    currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
    listAllCurrenciesUseCase = new ListAllCurrenciesUseCase(
      currenciesRepositoryInMemory
    );

    currencyDTO = {
      currencyCode: "CRC",
      currencyName: "Currency test",
      isFictional: false,
      priceUsd: 5,
    };
  });

  it("should be able to list all currencies", async () => {
    const currency = await currenciesRepositoryInMemory.addCurrency(
      currencyDTO
    );

    const allCurrencies = await listAllCurrenciesUseCase.execute();

    expect(allCurrencies).toEqual(expect.arrayContaining([currency]));
  });
});
