import { Module } from '@nestjs/common';

import { ConverterController } from './controllers/converter/converter.controller';

@Module({
    controllers: [ConverterController],
})
export class CurrencyModule {}
