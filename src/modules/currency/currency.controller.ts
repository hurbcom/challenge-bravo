import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import {
    CreateFictitiumDto,
    ResponseCurrencyDto,
    ResponseQuotationDto,
} from './dto';
import { Currency } from './entities';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryRequired, ApiGeneralDocumentation } from '../../libs/decorators';

@Controller('currencies')
@ApiTags('Currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    /**
     * @description Calculate exchange rate between to currencies
     * @param from
     * @param to
     * @param amount
     * @returns {ResponseQuotationDto}
     */
    @Get()
    @ApiGeneralDocumentation({
        model: ResponseQuotationDto,
        description: 'Calculate exchange rate between to currencies',
    })
    async quotation(
        @QueryRequired('from') from: string,
        @QueryRequired('to') to: string,
        @QueryRequired('amount') amount: string,
    ): Promise<ResponseQuotationDto> {
        return this.currencyService.quotation(from, to, +amount);
    }

    /**
     * @description Create a new dummy currency or update its exchange rate if it exists
     * @returns {ResponseCurrencyDto}
     */
    @Post()
    @ApiGeneralDocumentation({
        model: ResponseCurrencyDto,
        description:
            'Create a new dummy currency or update its exchange rate if it exists',
    })
    async create(
        @Body() body: CreateFictitiumDto,
    ): Promise<ResponseCurrencyDto> {
        return this.currencyService.create(body);
    }

    /**
     * @description Disable a currency
     * @returns {void}
     */
    @Delete(':code')
    @ApiGeneralDocumentation({ description: 'Disable a currency by its code' })
    async delete(@Param('code') code: string): Promise<void> {
        return this.currencyService.disable(code);
    }

    /**
     * @description List all available currencies
     * @returns {ResponseCurrencyDto[]}
     */
    @Get('/list')
    @ApiGeneralDocumentation({
        model: ResponseCurrencyDto,
        isArray: true,
        description: 'List all available currencies',
    })
    async list(): Promise<ResponseCurrencyDto[]> {
        return this.currencyService.list();
    }
}
