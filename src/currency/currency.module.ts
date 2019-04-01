import { Module } from '@nestjs/common';
import { ConverterController } from './controllers/converter/converter.controller';
import { CurrencyConverterService } from './services/currency-converter/currency-converter.service';


@Module({
    controllers: [ConverterController],
    providers: [CurrencyConverterService],
})
export class CurrencyModule {}
