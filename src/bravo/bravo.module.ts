import { Module, HttpModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BravoController } from './controllers';
import { CurrencyExchangeService, CurrencyService } from './services';
import { Currency } from './models';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Currency
    ]),
    HttpModule,
    LoggerModule,
  ],
  controllers: [
    BravoController,
  ],
  providers: [
    SequelizeModule,
    CurrencyExchangeService,
    CurrencyService,
  ],
})

export class BravoModule {}
