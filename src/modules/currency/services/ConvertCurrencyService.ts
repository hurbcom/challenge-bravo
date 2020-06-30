

import CurrencyRepository from '../infra/redis/CurrencyRepository'


class ConvertCurrencyService {
    private currencyRepository: CurrencyRepository

    constructor(currencyRepository: CurrencyRepository){
        this.currencyRepository = currencyRepository;
    }

    /**
     *
     * @param fromCurrency
     * @param toCurrency
     * @param amount
     *
     * converts the currency from one to another based on the given value based on the "from" currency
     */
    public async execute(fromCurrency: string, toCurrency: string, amount: number): Promise<number | undefined> {
        const fromCurrencyValue = await this.currencyRepository.recover(fromCurrency);
        const toCurrencyValue = await this.currencyRepository.recover(toCurrency);

        if(!fromCurrencyValue || !toCurrencyValue){
            return
        }

        if(fromCurrencyValue && toCurrencyValue){
            const result = ((amount * Number(fromCurrencyValue)) / Number(toCurrencyValue)).toFixed(2);
            return Number(result);
        }
        return;

    }
}

export default ConvertCurrencyService;