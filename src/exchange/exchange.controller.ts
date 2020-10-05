import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ConvertAmountDto } from './dto/convert-amount.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async convertAmount(@Query() convertAmountDto: ConvertAmountDto) {
    return await this.exchangeService.convertAmount(convertAmountDto);
  }
}
