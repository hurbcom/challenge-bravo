import { Controller, Get, Inject, Query } from '@nestjs/common';

import { CurrencyDto } from '../../dto/currency.dto';
import { ICurrencyConverter } from '../../interfaces/currency-converter.interface';

@Controller('converter')
export class ConverterController {
    constructor(
        @Inject('currencyConverter') private converter: ICurrencyConverter,
    ) {}

    @Get()
    async convert(@Query() { from, to, amount }: CurrencyDto): Promise<number> {
        return this.converter.convert(from, to, amount);
    }
}
