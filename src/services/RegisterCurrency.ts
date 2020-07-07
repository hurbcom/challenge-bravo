import { getCustomRepository } from 'typeorm';
import CurrenciesRepository from '../repositories/CurrenciesRepository';
import AppError from '../errors/AppError';
import Currency from '../models/Currency';

interface IRequest {
    name: string;
}

class RegisterCurrency {
    public async execute({ name }: IRequest): Promise<Currency> {
        const currenciesRepository = getCustomRepository(CurrenciesRepository);

        const checkExists = await currenciesRepository.findByName(name);

        if (checkExists) {
            throw new AppError('Moeda já registrada', 400);
        }

        const newCurrency = currenciesRepository.create({ name });

        await currenciesRepository.save(newCurrency);

        return newCurrency;
    }
}

export default RegisterCurrency;
