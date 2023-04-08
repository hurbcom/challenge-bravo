import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import {
    CreateFicticiusDto,
    ResponseCurrencyDto,
    ResponseQuotationDto,
} from './dto';
import { Currency } from './entities';

@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Post()
    async createQuotation(@Body() body: CreateFicticiusDto): Promise<Currency> {
        return this.currencyService.createQuotation(body);
    }

    @Delete(':code')
    async delete(@Param('code') code: string): Promise<any> {
        return this.currencyService.deleteCoin(code);
    }

    @Get()
    async getQuotation(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('amount') amount: string,
    ): Promise<ResponseQuotationDto> {
        return this.currencyService.getQuotation(from, to, +amount);
    }

    @Get('/reset')
    async reset(): Promise<void> {
        return this.currencyService.reset();
    }

    @Get('/list')
    async list(): Promise<ResponseCurrencyDto[]> {
        return this.currencyService.list();
    }
}
