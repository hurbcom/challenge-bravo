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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGeneralDocumentation } from 'src/libs/decorators/ApiGeneralDocumentation';

@Controller('currencies')
@ApiTags('Currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Post()
    @ApiGeneralDocumentation({
        model: ResponseCurrencyDto,
        description:
            'Create a new dummy currency or update its exchange rate if it exists',
    })
    async createQuotation(
        @Body() body: CreateFicticiusDto,
    ): Promise<ResponseCurrencyDto> {
        return this.currencyService.createQuotation(body);
    }

    @Delete(':code')
    @ApiGeneralDocumentation({ description: 'Disable a currency by its code' })
    async delete(@Param('code') code: string): Promise<void> {
        return this.currencyService.deleteCoin(code);
    }

    @Get()
    @ApiGeneralDocumentation({
        model: ResponseQuotationDto,
        description: 'Calculate exchange rate between to currencies',
    })
    async getQuotation(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('amount') amount: string,
    ): Promise<ResponseQuotationDto> {
        return this.currencyService.getQuotation(from, to, +amount);
    }

    // @Get('/reset')
    // @ApiGeneralDocumentation({})
    // async reset(): Promise<void> {
    //     return this.currencyService.reset();
    // }

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
