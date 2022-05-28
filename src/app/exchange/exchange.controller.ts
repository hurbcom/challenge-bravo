import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Exchanges')
@Controller('exchange')
export class ExchangeController {
  constructor(
    private readonly exchangeService: ExchangeService
  ) { }

  @Get()
  @ApiQuery({ name: 'from' })
  @ApiQuery({ name: 'to' })
  @ApiQuery({ name: 'amount' })
  convert(@Query('from') from: string, @Query('to') to: string, @Query('amount') amount: number) {
    return this.exchangeService.convert(from.toUpperCase(), to.toUpperCase(), amount);
  }
}
