import { getRepository, Repository } from "typeorm";

import { Currency } from "../../../entities/Currency";
import {
    ICurrenciesRepository,
    ICreateCurrencyDTO,
} from "../ICurrenciesRepository";


class CurrenciesRepository implements ICurrenciesRepository {
    private repository: Repository<Currency>;

    // private static INSTANCE: CurrenciesRepository;

    constructor() {
        this.repository = getRepository(Currency);
    }

    // public static getInstance(): CurrenciesRepository {
    //     if (!CurrenciesRepository.INSTANCE) {
    //         CurrenciesRepository.INSTANCE = new CurrenciesRepository();
    //     }
    //     return CurrenciesRepository.INSTANCE;
    // }

    async create({ symbol }: ICreateCurrencyDTO): Promise<void> {
        // const currency = new Currency();

        // Object.assign(currency, {
        //     symbol,
        // });

        const currency = this.repository.create({
            symbol,
        });

        await this.repository.save(currency);
    }

    async list(): Promise<Currency[]> {
        const currencies = await this.repository.find();
        return currencies;
    }

    async findBySymbol(symbol: string): Promise<Currency | undefined> {
        const currency = await this.repository.findOne({ symbol });
        return currency;
    }
}

export { CurrenciesRepository };
