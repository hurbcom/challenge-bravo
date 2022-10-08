import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversionModule } from './modules/conversion/conversion.module';

@Module({
  imports: [ConversionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
