import { BadRequestException, Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGeneralDocumentation } from 'src/libs/decorators/ApiGeneralDocumentation';

@Controller('healthz')
@ApiTags('Health')
export class HealthController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get()
    @ApiGeneralDocumentation({})
    check() {
        return;
    }

    @Get('/mongodb')
    @ApiGeneralDocumentation({})
    async mongodb() {
        const response = await this.currencyService.findOneCurrency('USD');
        console.log(response);
        if (!response) {
            throw new BadRequestException('Mongodb is not active');
        }
        return;
    }
}
