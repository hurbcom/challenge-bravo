import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeInputType } from './types/convert-input.type';
import { ExchangeType } from './types/convert.type';

@Injectable()
export class ConvertService {
    constructor(private currenciesServices: CurrenciesService) { }

    async currencyConvert({ from, to, amount }: ExchangeInputType): Promise<ExchangeType> {

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
                amount: currencyTo.value,
                rate: 1.0
            }
        } catch (error) {

            throw new InternalServerErrorException()

        }
    }


}
