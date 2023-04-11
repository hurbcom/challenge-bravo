import { ResponseQuotationDto } from 'src/modules/currency/dto';

export const ResponseQuotationDtoStub = (): ResponseQuotationDto => {
    return {
        info: {
            exchangeRate: 5,
            lastUpdate: '2023-04-11 00:29:01',
        },
        result: 500,
    };
};
