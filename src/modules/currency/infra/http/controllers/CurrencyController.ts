import { Request, Response } from 'express';

import CurrencyRepository from '../../redis/CurrencyRepository'

import ConvertCurrency from '../../../services/ConvertCurrencyService';
import CreateCurrencyService from '../../../services/CreateCurrencyService';

import defaultCurrencies from '../../../../../config/defaultCurrencies';
import FetchCurrenciesInformation from '../../../../../utils/FetchCurrencyInformation'

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
            const currencyCreated = await createCurrency.execute(String(name));
            return response.status(200).json(currencyCreated);
        }else{
            const currencyCreated = await createCurrency.execute(String(name), Number(value));
            return response.status(200).json(currencyCreated);
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
     *  Get timestamp from Redis and verifies if last update was less than 10 minutes ago,
     *  Fetches updated currency information from an external API,
     *  updates REDIS with information gathered
     *
     * @param request
     * @param response
     */

    public async fetchDefaultCurrencies(request: Request, response: Response): Promise<Response>{
        const getTimestamp = await currencyRepository.recover('_timestamp');
        const currentTime = new Date().getTime();
        const currencies = defaultCurrencies.currencies.join(',')

        if(Number(getTimestamp) + 600000 > currentTime){
            return response.status(200).json({mesage: 'currency up to date'});
        }

        const currencyFetcher = new FetchCurrenciesInformation();
        const currencyResult = await currencyFetcher.getDefaultCurrencies(currencies);

        defaultCurrencies.currencies.map(currency => {
            currencyRepository.save(currency, currencyResult[currency])
        })

        currencyRepository.timestamp();
        return response.status(200).json(currencyResult);
    }
}