import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGeneralDocumentation } from '../../libs/decorators/ApiGeneralDocumentation';

@Controller('healthz')
@ApiTags('Health')
export class HealthController {
    @Inject(CurrencyService)
    private readonly currencyService: CurrencyService;

    @Get()
    @ApiGeneralDocumentation({ description: 'Check api health' })
    check() {
        return;
    }

    @Get('/mongodb')
    @ApiGeneralDocumentation({ description: 'Check database health' })
    async mongodb() {
        const response = await this.currencyService.findOneCurrency('USD');
        if (!response) {
            throw new BadRequestException('Mongodb is not active');
        }
        return;
    }
}
