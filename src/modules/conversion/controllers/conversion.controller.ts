import { Controller, Get, Param } from '@nestjs/common';

import { ConversionService } from '../services/conversion.service';

@Controller('conversion')
export class ConversionController {
    constructor(private readonly _conversionService: ConversionService) {}

    @Get('/')
    async convert(@Param('to') to: string, @Param('from') from: string, @Param('value') value: number) {
        return await this._conversionService.convert({ to, from, value });
    }
}
