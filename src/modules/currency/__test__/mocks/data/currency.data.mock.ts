import { faker } from '@faker-js/faker';

import { CurrencyEntity } from '../../../entities/currency.entity';

export const newCurrencyMock = () => {
    const currency = new CurrencyEntity();
    currency.id = faker.datatype.uuid();
    currency.name = faker.datatype.string();
    currency.code = faker.datatype.string();
    currency.ratio = faker.datatype.number();
    currency.isActive = true;
    currency.createdAt = faker.datatype.datetime();
    currency.updatedAt = faker.datatype.datetime();
    return currency;
};

export const currencyDataMock = Array(10)
    .fill(null)
    .map(() => newCurrencyMock());
