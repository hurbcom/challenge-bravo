import { Module, HttpModule } from '@nestjs/common';
import { CurrencyFinderService } from './currency-finder.service'
import { ExtApisService } from '../external-apis/ext-apis.service'

/**
 *  Modulo para estebelecer as importações de Módulos e resolver as
 * injeções de dependências
 */
@Module({
    imports: [HttpModule],
    providers: [CurrencyFinderService, ExtApisService]
})
export class CurrencyFinderModule {}
