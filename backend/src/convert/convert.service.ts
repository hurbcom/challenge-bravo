import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

export class CurrenciesService {
    async getCurrency(getCurrency: string): Promise<any> {
        //
    }

}

@Injectable()
export class ConvertService {
    constructor(private currenciesServices: CurrenciesService) { }

    async currencyConvert({ from, to, amount }): Promise<any> {

        if (!from || !to || !amount)
            throw new BadRequestException()
        try {

            const currencyFrom = await this.currenciesServices.getCurrency(from)
            const currencyTo = await this.currenciesServices.getCurrency(to)

            if (!currencyFrom || !currencyTo) {
                throw new Error('Client requested rates for an unsupported currency')
            }

            return {
                base: 'USD',
                amount: currencyTo.value
            }
        } catch (error) {

            throw new InternalServerErrorException()

        }
    }


}
