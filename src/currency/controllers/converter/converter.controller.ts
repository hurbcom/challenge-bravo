import { Controller, Get, Query } from '@nestjs/common';

import { CurrencyDto } from '../../dto/currency.dto';

@Controller('converter')
export class ConverterController {
    @Get()
    async convert(@Query() query: CurrencyDto) {
        return {};
    }
}
