import { Module, HttpModule } from '@nestjs/common';
import { ExtApisService } from './ext-apis.service'

/**
 *  Modulo para estebelecer as importações de Módulos e resolver as
 * injeções de dependências
 */
@Module({
    imports: [HttpModule],
    providers: [ExtApisService]
})
export class ExternalApisModule {}
