import { AppError } from "../AppError";
import { inject, injectable } from "tsyringe";
import axios from 'axios';


import { CurrencyRepository } from "../repositories/CurrencyRepository";
import { ICurrency } from "../models/ICurrency";
import { ICurrencyRepository } from "../repositories/ICurrencyRepository";


interface ICurrentQuote {
    BRLInUSD: number;
    EURInUSD: number;
    BTCInUSD: number;
    ETHInUSD: number;

}

interface IConversionCurrency {
    convertedAmount:Number;
    currencyFrom: {};
    currencyTo: {}
}
@injectable()
class CurrencyService {

   // private currencyRepository = new CurrencyRepository();

   constructor(

    @inject("CurrencyRepository")
    private currencyRepository: ICurrencyRepository
  ) { }

    async create({ name, code, valueInUSD }: ICurrency): Promise<ICurrency> {

        const currencyAlreadyExists = await this.currencyRepository.getByCode(code);

        if (currencyAlreadyExists) {
            throw new AppError("Currency Already Exists");
        }

        const currency = await this.currencyRepository.create({ name, code, valueInUSD });

        return currency;
    }

    async listAll(): Promise<ICurrency[]> {

        const currencies = await this.currencyRepository.listAll();

        return currencies;
    }

    async update({ _id, name, code, valueInUSD }: ICurrency): Promise<void> {

        const currencyAlreadyExists = await this.currencyRepository.getById(_id);

        if (!currencyAlreadyExists) {
            throw new AppError("Currency does not exist");
        }

        const updated_at = new Date();

        await this.currencyRepository.update({ _id, name, code, valueInUSD, updated_at });


    }

    async delete(_id: string): Promise<void> {
        
        const currencyAlreadyExists = await this.currencyRepository.getById(_id);

        if (!currencyAlreadyExists) {
            throw new AppError("Currency does not exist");
        }

        await this.currencyRepository.delete(_id);

    }

    async conversionOfCurrency(from: string, to: string, amount: string): Promise<IConversionCurrency> {

        const amountFloat = parseFloat(amount);

        if (!amountFloat) {

            throw new AppError("Invalid Amount!");
        }

        const fromCurrency = await this.currencyRepository.getByCode(from.toUpperCase());

        const toCurrency = await this.currencyRepository.getByCode(to.toUpperCase());

        if (!fromCurrency || !toCurrency) {

            throw new AppError("Invalid Currency!");
        }

        const fromValueInUSD = fromCurrency.valueInUSD;

        const toValueInUSD = toCurrency.valueInUSD;

        const convertedAmount = parseFloat((amountFloat * (fromValueInUSD / toValueInUSD)).toFixed(2));

        const conversion = {
            convertedAmount,
            currencyFrom: {
                amount: amount + ' ' + from.toUpperCase(),
                quoteUSD: '1 ' + from.toUpperCase() + " is worth " + fromCurrency.valueInUSD + ' USD',
                quoteUSDUpdatedAt:fromCurrency.updated_at
            },
            currencyTo: {
                convertedAmount: convertedAmount + to.toUpperCase(),
                quoteUSD: '1 ' + to.toUpperCase() + " is worth " + toCurrency.valueInUSD + ' USD',
                quoteUSDUpdatedAt:toCurrency.updated_at
            }

        }

        return conversion;
    }

    async currentQuote(): Promise<ICurrentQuote> {

        const currentQuoteInBRL = await axios.get("https://api.hgbrasil.com/finance/quotations?key=b9524aa8");
        const { USD, EUR } = currentQuoteInBRL.data.results.currencies

        const BRLInUSD = parseFloat((1 / USD.sell).toFixed(2));
        const BRLCurrency = await this.currencyRepository.getByCode('BRL');
        BRLCurrency.valueInUSD = BRLInUSD;
        BRLCurrency.updated_at = new Date();
        await this.currencyRepository.update(BRLCurrency);


        const EURInUSD = parseFloat((EUR.sell / USD.sell).toFixed(2));
        const EURCurrency = await this.currencyRepository.getByCode('EUR');
        EURCurrency.valueInUSD = EURInUSD;
        EURCurrency.updated_at = new Date();
        await this.currencyRepository.update(EURCurrency);

        const cryptoCurrencyBTCInUSD = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/sell");

        const BTCInUSD = parseFloat(parseFloat(cryptoCurrencyBTCInUSD.data.data.amount).toFixed(2));
        const BTCCurrency = await this.currencyRepository.getByCode('BTC');
        BTCCurrency.valueInUSD = BTCInUSD;
        BTCCurrency.updated_at = new Date();
        await this.currencyRepository.update(BTCCurrency);


        const cryptoCurrencyETHInUSD = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/sell");

        const ETHInUSD = parseFloat(parseFloat(cryptoCurrencyETHInUSD.data.data.amount).toFixed(2));
        const ETHCurrency = await this.currencyRepository.getByCode('ETH');
        ETHCurrency.valueInUSD = ETHInUSD;
        ETHCurrency.updated_at = new Date();
        await this.currencyRepository.update(ETHCurrency);


        const currentsQuotes: ICurrentQuote = {
            BRLInUSD,
            EURInUSD,
            BTCInUSD,
            ETHInUSD

        }

        return currentsQuotes


    }
}

export { CurrencyService }