import { BadRequestException, Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';

@Controller('healthz')
export class HealthController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get()
    check() {
        return;
    }

    @Get('/mongodb')
    async mongodb() {
        const response = await this.currencyService.findOneCurrency('USD');
        console.log(response);
        if (!response) {
            throw new BadRequestException('Mongodb is not active');
        }
        return;
    }
}
