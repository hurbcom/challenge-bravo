import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BravoModule } from './bravo/bravo.module';
import { Currency } from './bravo/models';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './database-bravo.sqlite',
      models: [Currency],
    }),
    BravoModule,
    LoggerModule,
  ]
})

export class AppModule {}
