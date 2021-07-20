import { ICurrency, Currency } from "../models/Currency";


class CurrencyRepository {

    async create({ name, code, valueInReal }: ICurrency): Promise<ICurrency> {
        const currency = await new Currency({ name, code, valueInReal }).save();
        return currency;
    }

    async listAll(): Promise<ICurrency[]> {

        const currencies = await Currency.find();

        return currencies;
    }

    async getById(_id: string): Promise<ICurrency> {

        const currency = await Currency.findById({ _id });

        return currency;
    }

    async getBySigla(code: string): Promise<ICurrency> {

        const currency = await Currency.findOne({ code })

        return currency;
    }

    async delete(_id: string): Promise<void> {
        await Currency.deleteOne({ _id });
    }

    async update({ _id, name, code, valueInReal }: ICurrency): Promise<ICurrency> {

        const currency = await Currency.findByIdAndUpdate({ _id }, { name, code, valueInReal })

        return currency;
    }

}

export { CurrencyRepository }