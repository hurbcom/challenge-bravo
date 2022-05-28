import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrencyDto } from 'src/core/database/currencyDb/currency.dto';

@ApiTags('Currencies')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Post()
  @ApiQuery({ name: 'currency', required: true })
  @ApiQuery({ name: 'rate', required: false })
  create(@Query('currency') currency: string, @Query('rate') rate: number) {
    return this.currencyService.create({ currency: currency, rate: rate });
  }

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExchangeDto: any) {
    return this.currencyService.update(+id, updateExchangeDto);
  }

  @Delete()
  @ApiQuery({ name: 'currency', required: true })
  remove(@Query('currency') currency: string) {
    return this.currencyService.remove(currency);
  }
}
