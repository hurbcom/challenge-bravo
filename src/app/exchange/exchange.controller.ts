import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Exchanges')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) { }

  @Post()
  create(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.create(createExchangeDto);
  }

  @Get()
  @ApiQuery({ name: 'from' })
  @ApiQuery({ name: 'to' })
  @ApiQuery({ name: 'amount' })
  convert(@Query('from') from: string, @Query('to') to: string, @Query('amount') amount: number) {
    return this.exchangeService.convert(from, to, amount);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExchangeDto: UpdateExchangeDto) {
    return this.exchangeService.update(+id, updateExchangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeService.remove(+id);
  }
}
