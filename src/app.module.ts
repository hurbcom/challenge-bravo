import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtApisService } from './external-apis/ext-apis.service';
import { CurrencyFinderService } from './currency-finder/currency-finder.service';
import { CryptoController } from './crypto/crypto.controller';
import { CurrencyController } from './currency/currency.controller';
import { CurrencyModule } from './currency/currency.module';
import { CryptoModule } from './crypto/crypto.module';
import { CurrencyFinderModule } from './currency-finder/currency-finder.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import { CryptoService } from './crypto/crypto.service';
import { CurrencyService } from './currency/currency.service';




@Module({
    imports: [
    HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
    }),
    CurrencyModule,
    CryptoModule,
    ExternalApisModule,
    CurrencyFinderModule,
],
  controllers: [
      AppController,
      CryptoController,
      CurrencyController
    ],
  providers: [
      AppService,
      ExtApisService,
      CurrencyFinderService,
      CryptoService,
      CurrencyService,
    ],
})
export class AppModule {}
