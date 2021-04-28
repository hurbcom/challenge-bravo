import { Injectable, InternalServerErrorException } from '@nestjs/common';

export class Currencies {
    currency: string;
}

export class CurrenciesRepository {
    async getCurrency(currency: string): Promise<Currencies> {
        return new Currencies();
    }
}

@Injectable()
export class CurrenciesService {
    constructor(private currenciesRepository: CurrenciesRepository) {}
    async getCurrency(currency: string): Promise<any> {
        try {
            return await this.currenciesRepository.getCurrency(currency);
        } catch (error) {
            throw new InternalServerErrorException();

        }

        //
    }

}
