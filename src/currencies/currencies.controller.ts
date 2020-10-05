import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Currencies } from './currencies.entity';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create.currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCurrency(@Body() createCurrencyDto: CreateCurrencyDto): Promise<any> {
    return await this.currenciesService.createCurrency(createCurrencyDto);
  }

  @Delete('/:currency')
  async deleteCurrency(@Param('currency') currency: string) {
    return await this.currenciesService.deleteCurrency(currency);
  }

  @Patch('/:currency/value')
  @UsePipes(ValidationPipe)
  async updateCurrency(
    @Param('currency') currency: string,
    @Body('value') value: number,
  ): Promise<any> {
    return await this.currenciesService.updateCurrency({ currency, value } as Currencies);
  }
}
