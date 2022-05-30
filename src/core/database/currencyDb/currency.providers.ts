import { Currency } from './currency.entity';

export const currenciesProviders = [{
    provide: 'CURRENCY_REPOSITORY',
    useValue: Currency,
}];