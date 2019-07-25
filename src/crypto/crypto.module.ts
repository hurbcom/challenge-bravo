import { Module, HttpModule } from '@nestjs/common';
import { ExtApisService } from '../external-apis/ext-apis.service';
import { CryptoService } from './crypto.service';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';


/**
 *  Modulo para estebelecer as importações de Módulos e resolver as
 * injeções de dependências
 */
@Module({
    imports: [HttpModule],
    providers: [CryptoService, CurrencyFinderService, ExtApisService]
})
export class CryptoModule {}
