import { getCustomRepository } from 'typeorm';

import { query } from 'express';
import CurrenciesRepository from '../repositories/CurrenciesRepository';
import api from '../utils/Api';
import AppError from '../errors/AppError';

interface IRequest {
    from: string;
    to: string;
    amount: number;
}

interface IResponse {
    base_currency: string;
    amount_base: number;
    converted_currency: string;
    amount_converted: number;
}

class ConvertCurrenciesService {
    public async execute({
        from,
        to,
        amount,
    }: IRequest): Promise<IResponse | undefined> {
        const currenciesRepository = getCustomRepository(CurrenciesRepository);

        const checkFromExists = await currenciesRepository.findByName(from);

        if (!checkFromExists) {
            throw new AppError('Moeda ainda não registrada na API');
        }

        const checkToExists = await currenciesRepository.findByName(to);

        if (!checkToExists) {
            throw new AppError('Moeda ainda não registrada na API');
        }

        const rapidURL = process.env.RAPIDI_URL;
        const rapidHost = process.env.RAPIDI_HOST;
        const rapidKey = process.env.RAPIDI_KEY;

        if (!rapidKey || !rapidURL || !rapidHost) {
            throw new AppError('Api não disponível');
        }

        const response = await api.get(rapidURL, {
            headers: {
                'x-rapidapi-host': rapidHost,
                'x-rapidapi-key': rapidKey,
                useQueryString: true,
            },
            params: {
                format: 'json',
                from,
                to,
                amount: Number(amount),
            },
        });

        if (response.data.error) {
            throw new AppError('Falha ao consumir API');
        }

        console.log(response.data);
        console.log(response.data.base_currency_code);
        console.log(response.data.amount);
        console.log(response.data.rates.to);
        console.log(response.data.rates.to.rate);

        return {
            base_currency: response.data.base_currency_code,
            amount_base: response.data.amount,
            converted_currency: response.data.rates.to,
            amount_converted: response.data.rates.to.rate,
        } as IResponse;
    }
}

export default ConvertCurrenciesService;
