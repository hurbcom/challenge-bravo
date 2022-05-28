import { Controller, Get, Post, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Currencies')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Post()
  @ApiQuery({ name: 'currency', required: true })
  @ApiQuery({ name: 'rate', required: false })
  create(@Query('currency') currency: string, @Query('rate', ParseIntPipe) rate: number = null) {
    return this.currencyService.create({ currency: currency.toUpperCase(), rate: rate });
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(@Query('limit', ParseIntPipe) limit: number = 10, @Query('page', ParseIntPipe) page: number = 1) {
    return this.currencyService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id.toUpperCase());
  }

  @Delete(':id')
  remove(@Param('id') currency: string) {
    return this.currencyService.remove(currency.toUpperCase());
  }
}
