import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CurrencyModule } from '../currency/currency.module';

@Module({
    imports: [CurrencyModule],
    controllers: [HealthController],
})
export class HealthModule {}
