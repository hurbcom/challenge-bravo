import { AppError } from "../AppError";
import { ICurrency } from "../models/Currency";

import { CurrencyRepository } from "../repositories/CurrencyRepository";



class CurrencyService {

    private currencyRepository = new CurrencyRepository();

    async create({ name, code, valueInReal }: ICurrency): Promise<ICurrency> {

        const currencyAlreadyExists = await this.currencyRepository.getBySigla(code);

        if (currencyAlreadyExists) {
            throw new AppError("Currency Already Exists");
        }

        const currency = await this.currencyRepository.create({ name, code, valueInReal });

        return currency;
    }

    async listAll(): Promise<ICurrency[]> {

        const currencies = await this.currencyRepository.listAll();

        return currencies;
    }

    async update({ _id, name, code, valueInReal }: ICurrency): Promise<ICurrency> {


        const currency = await this.currencyRepository.update({ _id, name, code, valueInReal });

        return currency;
    }

    async delete(_id: string): Promise<void> {

        await this.currencyRepository.delete(_id);

    }

    async conversionOfCurrency(from: string, to: string, amount: string): Promise<Number> {

        const amountFloat = parseFloat(amount);

        if (!amountFloat) {

            throw new AppError("Invalid Amount!");
        }

        const fromCurrency = await this.currencyRepository.getBySigla(from.toUpperCase());

        const toCurrency = await this.currencyRepository.getBySigla(to.toUpperCase());

        if (!fromCurrency || !toCurrency) {

            throw new AppError("Invalid Coin!");
        }

        const fromValueInReal = fromCurrency.valueInReal;

        const toValueInReal = toCurrency.valueInReal;

        const convertedAmount = parseFloat((amountFloat * (fromValueInReal / toValueInReal)).toFixed(4))

        return convertedAmount;
    }
}

export { CurrencyService }