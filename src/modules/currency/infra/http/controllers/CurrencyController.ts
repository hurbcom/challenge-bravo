import {Request, Response} from 'express';

import CurrencyRepository from '../../redis/CurrencyRepository'

import CreateCurrencyService from '../../../services/CreateCurrencyService';
import ConvertCurrency from '../../../services/ConvertCurrencyService';

import FetchCurrenciesInformation from '../../../../../utils/fetchCurrencyInformation'
import treatCurrency from '../../../../../utils/treatCurrency';

import defaultCurrencies from '../../../../../config/defaultCoins';

const currencyRepository = new CurrencyRepository();

export default class CurrencyController {
    public async recover(request: Request, response: Response): Promise<Response> {
        const { currency } = request.query;
        const currencies = await currencyRepository.recover(String(currency));
        return response.status(200).json(currencies);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, value } = request.query;
        const createCurrency = new CreateCurrencyService(currencyRepository);
        if(!value){
            createCurrency.execute(String(name));
            return response.status(200).json({message: 'currency added to database'});
        }else{
            createCurrency.execute(String(name), Number(value));
            return response.status(200).json({message: 'currency added to database'});
        }
    }

    public async remove(request: Request, response: Response): Promise<Response> {
        const { name } = request.query;
        if(name === '_timestamp') {
            return response.status(401).json({error: 'unauthorized'});
        }
        currencyRepository.invalidate(String(name));
        return response.status(200).json({message: 'currency removed'});
    }

    /**
     *
     * @param request
     * @param response
     *
     * Converts currency from query params using the ones available in the database.
     * Needs "from", "to" currency and a "amount".
     */
    public async convert(request: Request, response: Response): Promise<Response>{
        const { from, to, amount } = request.query;

        const fromCurrencyExists = currencyRepository.recover(String(from));
        const toCurrencyExists = currencyRepository.recover(String(to));
        if(!fromCurrencyExists || !toCurrencyExists) return response.status(200).json({error: 'Currency does not exists'});

        const convertCurrency = new ConvertCurrency(currencyRepository);
        const result = await convertCurrency.execute(String(from), String(to), Number(amount));

        return response.status(200).json(result);
    }

    /**
     *  Fetches updated currency information from an external API, updates REDIS information
     *
     * @param request
     * @param response
     */

    public async fetchCurrencies(request: Request, response: Response): Promise<Response>{
        const fetchCurrencies = new FetchCurrenciesInformation();
        const createCurrency = new CreateCurrencyService(currencyRepository);

        /**
         * Verifies if last update was in the last 10 minutes
         */
        const timestamp = new Date().getTime()
        const lastUpdate = await currencyRepository.recover('_timestamp')
        if(lastUpdate && !(Number(lastUpdate) + 600000 < timestamp )){
            return response.status(200).json({message: 'currencies up to date'});
        }

        /**
         * Fetches updated currency information from awesomeAPI
         */

        const currencies = await fetchCurrencies.getDefaultCurrencies();
        await currencyRepository.timestamp('_timestamp', new Date().getTime());

        /**
         * Maps the currency array and updates Redis Database with the information
         * fetched from awesomeAPI, treating the values to be based on USD instead of
         * BRL (default currency in the api)
         */

        defaultCurrencies.currencies.map(async currency => {
            const treatedCurrency = treatCurrency(currencies['USD'].ask, currencies[currency].ask);
            await createCurrency.execute(currency, treatedCurrency)
        })
            await createCurrency.execute('BRL', treatCurrency(currencies['USD'].ask, 1));
        return response.status(200).json(currencies);
    }
}