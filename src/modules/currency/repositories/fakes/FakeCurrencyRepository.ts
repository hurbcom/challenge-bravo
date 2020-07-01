import ICurrencyRepository from '../ICurrencyRepository';
interface IFakeCurrency {
    [name: string]: number;
}

class FakeCurrencyRepository implements ICurrencyRepository {
    private currencies = {};

    constructor() {
        this.currencies =
            {
                BRL: 5.446,
                USD: 1,
                EUR: 0.89,
                BTC: 0.0001091,
                ETH: 0.004395,
            }
    }

    public async save(name: string, value: number): Promise<void>{
        const currency = this.currencies[name] = Number(value);
    }

    public async timestamp(): Promise<void>{
        const name = 'timestamp';
        this.currencies[name] = 123456;
    };

    public async recover<T>(key:string): Promise<T | void> {
        const data = this.currencies[key];

        if(!data){
            return;
        }

        const parsedData = JSON.parse(data) as T;
        return parsedData;
    };

    public async invalidate(key: string): Promise<void>{
        delete this.currencies[key];
    };
}

export default FakeCurrencyRepository;
