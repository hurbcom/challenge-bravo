import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ResponseCurrencyDto, ResponseQuotationDto } from './dto';

@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

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
