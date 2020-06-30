import Currency from '../../infra/models/Currency'

interface ICurrencyRepository {
    create(name: string, baseValue: number): Currency;
    find(name: string): Currency | undefined;
}

class CurrencyRepository implements ICurrencyRepository {
    private currencies: Currency[];

    constructor() {
        this.currencies = [
            {
                name: "USD",
                baseValue: 1
            },
            {
                name: "BRL",
                baseValue: 0.19
            },
            {
                name: "EUR",
                baseValue: 1.12
            },
            {
                name: "BTC",
                baseValue: 9239.59
            },
            {
                name: "ETH",
                baseValue: 234.55
            },
        ]
    }

    public create(name: string, baseValue: number): Currency{
        const currency = new Currency(name, baseValue);
        this.currencies.push(currency);

        return currency;
    }

    public find(name: string): Currency | undefined {
        const currency = this.currencies.find(currencies => currencies.name === name);
        return currency;
    }
}

export default CurrencyRepository;
