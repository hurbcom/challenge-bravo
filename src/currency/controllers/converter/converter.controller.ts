import { Controller, Get, Inject, Query } from '@nestjs/common';

import { Currency } from '../../definitions/currency';
import { CurrencyDto } from '../../dto/currency.dto';
import { ICurrencyConverter } from '../../interfaces/currency-converter.interface';

@Controller('converter')
export class ConverterController {
    constructor(
        @Inject('currencyConverter') private converter: ICurrencyConverter,
    ) {}

    @Get()
    async convert(@Query() { from, to, amount }: CurrencyDto): Promise<{
        from: Currency;
        to: Currency;
        convertedAmount: number;
    }> {
        const convertedAmount = await this.converter.convert(from, to, amount);
        return { from, to, convertedAmount };
    }
}
