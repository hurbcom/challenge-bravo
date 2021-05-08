import { CurrenciesRepositoryInMemory } from "@modules/currencies/repositories/in-memory/CurrenciesRepositoryInMemory";
import { ExchangesRepositoryInMemory } from "@modules/exchanges/repositories/in-memory/ExchangesRepositoryInMemory";

import { CreateExchangeUseCase } from "./createExchangeUseCase";

let createExchangeUseCase: CreateExchangeUseCase;
let exchangesRepositoryInMemory: ExchangesRepositoryInMemory;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;

describe("Create Exchange", () => {
    beforeEach(() => {
        exchangesRepositoryInMemory = new ExchangesRepositoryInMemory();
        currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
        createExchangeUseCase = new CreateExchangeUseCase(
            exchangesRepositoryInMemory,
            currenciesRepositoryInMemory
        );
    });

    it("should  be able to create a new exchange", async () => {
        const exchange = await createExchangeUseCase.execute({
            from: "USD",
            to: "BRL",
            amount: 25,
        });

        expect(exchange).toHaveProperty("id");
        expect(exchange).toHaveProperty("created_date");
    });
});
