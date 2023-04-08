import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { ResponseQuotationDto } from './dto';

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
}
