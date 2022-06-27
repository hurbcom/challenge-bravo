import { CurrencyExchange } from "@/domain/entity";
import faker from "@faker-js/faker";

export const currencyMock = () => {
    const name = faker.word.verb();

    return new CurrencyExchange({
        code: name.slice(0, 5),
        name,
        value: Number(faker.finance.amount(0.1, 200, 5)),
    });
};
