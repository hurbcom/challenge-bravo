import { CreateFictitiumDto } from 'src/modules/currency/dto';

export const CreateFictitiumDtoStub = (): CreateFictitiumDto => {
    return {
        name: 'PSN Coin',
        code: 'PSN',
        baseCode: 'USD',
        amount: 1250000,
        baseAmount: 84.5,
    };
};
