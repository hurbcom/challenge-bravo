import { AppError } from "../AppError";
import { inject, injectable } from "tsyringe";
import axios from 'axios';



import { ICurrency } from "../models/ICurrency";
import { ICurrencyRepository } from "../repositories/ICurrencyRepository";

import { ICache } from "../cache/ICache";


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
    private currencyRepository: ICurrencyRepository,

    @inject("RedisCache")
    private cache: ICache
  ) { }

    async create({ name, code, valueInUSD }: ICurrency): Promise<ICurrency> {

        const currencyAlreadyExists = await this.currencyRepository.getByCode(code);

        if (currencyAlreadyExists) {
            throw new AppError("Currency Already Exists");
        }

        const currency = await this.currencyRepository.create({ name, code, valueInUSD });

        
        await this.cache.delete('currencyLIST');

        return currency;
    }

    async listAll(): Promise<ICurrency[]> {

        

        let currencies = await this.cache.recover<ICurrency[]>(
      'currencyLIST',
    );

    if (!currencies) {
        currencies = await this.currencyRepository.listAll();
        const expiryTimeInSeconds = 24 * 60 * 60;
        await this.cache.save('currencyLIST', currencies, expiryTimeInSeconds);
        
      }

              
        return currencies;
    }

    async update({ _id, name, code, valueInUSD }: ICurrency): Promise<void> {

        const currencyAlreadyExists = await this.currencyRepository.getById(_id);

        if (!currencyAlreadyExists) {
            throw new AppError("Currency does not exist");
        }

        const updated_at = new Date();

        await this.currencyRepository.update({ _id, name, code, valueInUSD, updated_at });

        

         await this.cache.delete('currencyLIST');


    }

    async delete(_id: string): Promise<void> {
        
        const currencyAlreadyExists = await this.currencyRepository.getById(_id);

        if (!currencyAlreadyExists) {
            throw new AppError("Currency does not exist");
        }

        await this.currencyRepository.delete(_id);

        

         await this.cache.delete('currencyLIST');

    }

    async conversionOfCurrency(from: string, to: string, amount: string): Promise<IConversionCurrency> {


        const amountFloat = parseFloat(amount);

        if (!amountFloat) {

            throw new AppError("Invalid Amount!");
        }
        
        let fromCurrency = null;
        let toCurrency =  null;

        console.log(from);

        let currencies = await this.cache.recover<ICurrency[]>('currencyLIST');

        if(currencies){
            fromCurrency = currencies.find(c => c.code === from.toUpperCase());

            toCurrency = currencies.find(c => c.code === to.toUpperCase());

            console.log(currencies);

        } else {

         fromCurrency = await this.currencyRepository.getByCode(from.toUpperCase());

         toCurrency = await this.currencyRepository.getByCode(to.toUpperCase());


         currencies = await this.currencyRepository.listAll();
         const expiryTimeInSeconds = 24 * 60 * 60;
         await this.cache.save('currencyLIST', currencies, expiryTimeInSeconds);
        }

        if (!fromCurrency || !toCurrency) {

            throw new AppError("Invalid Currency!");
        }

        const fromValueInUSD = fromCurrency.valueInUSD;

        const toValueInUSD = toCurrency.valueInUSD;

        const convertedAmount = amountFloat * (fromValueInUSD / toValueInUSD);

        const conversion = {
            convertedAmount,
            currencyFrom: {
                amount: amount + ' ' + from.toUpperCase(),
                quoteUSD: '1 ' + from.toUpperCase() + " is worth " + fromCurrency.valueInUSD + ' USD',
                quoteUSDUpdatedAt:fromCurrency.updated_at
            },
            currencyTo: {
                convertedAmount: convertedAmount +' ' + to.toUpperCase(),
                quoteUSD: '1 ' + to.toUpperCase() + " is worth " + toCurrency.valueInUSD + ' USD',
                quoteUSDUpdatedAt:toCurrency.updated_at
            }

        }

        return conversion;
    }

    async currentQuote(): Promise<ICurrentQuote> {

        

        let currentsQuotes = await this.cache.recover<ICurrentQuote>('CurrentQuote');

        if(currentsQuotes){
            
            return currentsQuotes 
        }

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


        currentsQuotes = {
            BRLInUSD,
            EURInUSD,
            BTCInUSD,
            ETHInUSD

        }

        const expiryTimeInSeconds = 24 * 60 * 60;
        await this.cache.save('CurrentQuote', currentsQuotes, expiryTimeInSeconds);
        

        return currentsQuotes


    }
}

export { CurrencyService }