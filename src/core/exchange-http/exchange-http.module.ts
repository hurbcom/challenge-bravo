import { Module } from '@nestjs/common';
import { ExchangeHttpService } from './exchange-http.service';

@Module({
  providers: [ExchangeHttpService],
  exports: [ExchangeHttpService]
})
export class ExchangeHttpModule {}
