import { CurrencyExchange } from "@/domain/entity";

describe("Curreny", () => {
    it("Should be possible to create a currency", () => {
        const data = new Date();
        jest.useFakeTimers().setSystemTime(data);

        const usd = new CurrencyExchange({
            code: "usd",
            name: "Dólar dos EUA",
            value: 1,
        });

        expect({ ...usd }).toStrictEqual({
            code: "USD",
            name: "Dólar dos EUA",
            value: 1,
            createdAt: data,
            updatedAt: data,
        });
    });

    it("Should be possible to update the value of currency", () => {
        const data = new Date();
        jest.useFakeTimers().setSystemTime(data);

        const eur = new CurrencyExchange({
            code: "eur",
            name: "Euro",
            value: 1.1629,
        });

        expect({ ...eur }).toStrictEqual({
            code: "EUR",
            name: "Euro",
            value: 1.1629,
            createdAt: data,
            updatedAt: data,
        });

        eur.updateValue(1.2345);
        expect(eur.value).toEqual(1.2345);
    });

    it("Can't be possible to create a currency with a negative value", async () => {
        const code = "xyw";
        await expect(() => {
            new CurrencyExchange({
                code,
                name: "XYw",
                value: -1.1629,
            });
        }).toThrowError(`The value can't be negative or zero`);
    });
});
