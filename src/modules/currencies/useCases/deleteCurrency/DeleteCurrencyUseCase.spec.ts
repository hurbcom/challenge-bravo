import { AppError } from "../../../../shared/errors/AppError";
import { ICreateCurrencyDTO } from "../../dtos/ICreateCurrencyDTO";
import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import { DeleteCurrencyUseCase } from "./DeleteCurrencyUseCase";

let deleteCurrencyUseCase: DeleteCurrencyUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;
let currencyDTO: ICreateCurrencyDTO;

describe("Create currency", () => {
  beforeEach(() => {
    currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
    deleteCurrencyUseCase = new DeleteCurrencyUseCase(
      currenciesRepositoryInMemory
    );

    currencyDTO = {
      currencyCode: "CRC",
      currencyName: "Currency test",
      isFictional: false,
      priceUsd: 5,
    };
  });

  it("should be able to delete a currency", async () => {
    await currenciesRepositoryInMemory.addCurrency(currencyDTO);

    await deleteCurrencyUseCase.execute(currencyDTO.currencyCode);

    const currencies = await currenciesRepositoryInMemory.getAll();

    expect(currencies).toEqual([]);
  });

  it("should not be able to delete a currency that not registred", async () => {
    await expect(async () => {
      await deleteCurrencyUseCase.execute(currencyDTO.currencyCode);
    }).rejects.toBeInstanceOf(AppError);
  });
});
