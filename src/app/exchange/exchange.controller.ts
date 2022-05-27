import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exchanges')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  create(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.create(createExchangeDto);
  }

  @Get()
  findAll() {
    return this.exchangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeService.findOne(+id);
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
