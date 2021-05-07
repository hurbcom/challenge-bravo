import { AppError } from "@shared/errors/AppError";

import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

let createCurrencyUseCase: CreateCurrencyUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;

describe("Create Currency", () => {
    beforeEach(() => {
        currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
        createCurrencyUseCase = new CreateCurrencyUseCase(
            currenciesRepositoryInMemory
        );
    });

    it("should be able to create a new currency", async () => {
        const currency = {
            symbol: "USD",
        };

        await createCurrencyUseCase.execute({
            symbol: currency.symbol,
        });

        const currencyCreated = await currenciesRepositoryInMemory.findBySymbol(
            currency.symbol
        );

        expect(currencyCreated).toHaveProperty("id");
    });

    it("should not be able to create a new currency with symbol exists", async () => {
        const currency = {
            symbol: "USD",
        };

        await createCurrencyUseCase.execute({
            symbol: currency.symbol,
        });

        await expect(
            createCurrencyUseCase.execute({
                symbol: currency.symbol,
            })
        ).rejects.toEqual(new AppError("Currency already exists"));
    });
});
