import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtApisService } from './external-apis/ext-apis.service';
import { CurrencyFinderService } from './currency-finder/currency-finder.service';



@Module({
    imports: [HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
    })],
  controllers: [AppController],
  providers: [
      AppService,
      ExtApisService,
      CurrencyFinderService,
    ],
})
export class AppModule {}
