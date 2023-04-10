import { CreateFicticiusDto } from 'src/modules/currency/dto';

export const CreateFicticiusDtoStub = (): CreateFicticiusDto => {
    return {
        name: 'PSN Coin',
        code: 'PSN',
        baseCode: 'BRL',
        amount: 125000000,
        baseAmount: 84.5,
    };
};
