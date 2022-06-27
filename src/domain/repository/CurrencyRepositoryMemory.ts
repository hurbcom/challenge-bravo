import { CreateCurrencyExchange, CurrencyExchange } from "@/domain/entity";
import { AlreadyExistsException } from "@/domain/exception";
import { CurrencyRepository } from "@/domain/repository";

export class CurrencyRepositoryMemory implements CurrencyRepository {
    private currencys: CurrencyExchange[] = [
        new CurrencyExchange({
            code: "USD",
            name: "Dólar dos EUA",
            value: 1,
        }),
        new CurrencyExchange({
            code: "BRL",
            name: "Real brasileiro",
            value: 0.19444,
        }),
        new CurrencyExchange({
            code: "EUR",
            name: "Euro",
            value: 1.053,
        }),
        new CurrencyExchange({
            code: "BTC",
            name: "Bitcoin",
            value: 21312,
        }),
        new CurrencyExchange({
            code: "ETH",
            name: "Ether",
            value: 1183.9,
        }),
    ];

    async findAll(): Promise<CurrencyExchange[]> {
        return this.currencys;
    }

    async getByCode(code: string): Promise<CurrencyExchange> {
        const currency = this.currencys.find((currency) => {
            return currency.code === code.toUpperCase();
        });
        return currency;
    }

    async create(
        currencyExchange: CreateCurrencyExchange
    ): Promise<CurrencyExchange> {
        const existCurrency = await this.getByCode(currencyExchange.code);
        if (existCurrency) {
            throw new AlreadyExistsException(
                `The currency ${existCurrency.code} already exists`
            );
        }
        const currency = new CurrencyExchange(currencyExchange);
        this.currencys.push(currency);
        return currency;
    }

    async update(code: string, value: number): Promise<CurrencyExchange> {
        const currency = await this.getByCode(code);
        currency.updateValue(value);
        return currency;
    }

    async remove(code: string): Promise<void> {
        this.currencys = this.currencys.filter(
            (currency) => currency.code !== code.toUpperCase()
        );
    }
}
