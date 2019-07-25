import { Module, HttpModule } from '@nestjs/common';
import { ExtApisService } from '../external-apis/ext-apis.service';
import { CurrencyService } from './currency.service';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';


/**
 *  Modulo para estebelecer as importações de Módulos e resolver as
 * injeções de dependências
 */
@Module({
    imports: [HttpModule],
    providers: [CurrencyService, CurrencyFinderService, ExtApisService]
})
export class CurrencyModule {}
