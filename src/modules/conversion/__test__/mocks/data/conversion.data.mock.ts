import { faker } from '@faker-js/faker';

export const conversionDataMock = [
    {
        id: faker.datatype.uuid(),
        name: 'Real',
        code: 'BRL',
        ratio: 0.2,
        isActive: true,
    },
    {
        id: faker.datatype.uuid(),
        name: 'Dólar',
        code: 'USD',
        ratio: 1,
        isActive: true,
    },
    {
        id: faker.datatype.uuid(),
        name: 'Euro',
        code: 'EUR',
        ratio: 0.4,
        isActive: true,
    },
    {
        id: faker.datatype.uuid(),
        name: 'Bitcoin',
        code: 'BTC',
        ratio: 0.0000001,
        isActive: true,
    },
];
