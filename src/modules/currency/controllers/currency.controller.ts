import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrencyDto } from '../dto/currency.dto';
import { CurrencyService } from '../services/currency.service';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
    constructor(private readonly _currencyService: CurrencyService) {}

    @Get('/')
    @ApiResponse({
        type: [CurrencyDto],
        status: 200,
    })
    async getCurrency() {
        return this._currencyService.getCurrency();
    }

    @Get('/:id')
    @ApiResponse({
        type: CurrencyDto,
    })
    async getCurrencyById(@Param('id') id: string) {
        return this._currencyService.getCurrencyById(id);
    }

    @Post('/')
    @ApiBody({
        type: CurrencyDto,
    })
    async createCurrency(@Body() data: CurrencyDto) {
        return this._currencyService.createCurrency(data);
    }

    @Put('/:id')
    @ApiBody({
        type: CurrencyDto,
    })
    @ApiResponse({
        type: CurrencyDto,
    })
    async updateCurrency(@Param('id') id: string, @Body() data: CurrencyDto) {
        return this._currencyService.updateCurrency(id, data);
    }

    @Delete('/:id')
    async deleteCurrency(@Param('id') id: string) {
        return this._currencyService.deleteCurrency(id);
    }
}
