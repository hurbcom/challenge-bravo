import { Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyExchangeService, CurrencyService } from '../services';
import { Currency } from '../models';

@ApiTags('bravo')
@Controller()
export class BravoController {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly currencyExchangeService: CurrencyExchangeService
  ) {}

  @Get('currencies')
  @ApiResponse({ status: HttpStatus.OK, description: 'Get currencies' })
  public async getCurrenciesList(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }

  @Post('currency/:currencyName')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Add a new currency' })
  public async addCurrency(
    @Param('currencyName') currency: string,
  ): Promise<Currency> {
    return this.currencyService.insert(currency);
  }

  @Delete('currency/:currencyName')
  @ApiResponse({ status: HttpStatus.OK, description: 'Delete one currency' })
  public async removeCurrency(
    @Param('currencyName') currency: string,
  ): Promise<void> {
    await this.currencyService.removeByName(currency);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Get a currency transformation' })
  public async getHello(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
  ): Promise<number> {
    const fromCurrency: Currency = await this.currencyService.findOneByName(from);
    if (!fromCurrency) {
      throw new NotFoundException(`There is no currency "${from}".`);
    }
    const toCurrency: Currency = await this.currencyService.findOneByName(to);
    if (!toCurrency) {
      throw new NotFoundException(`There is no currency "${to}".`);
    }

    return this.currencyExchangeService.exchange(fromCurrency, toCurrency, amount);
  }
}
