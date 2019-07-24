import { Module, HttpModule } from '@nestjs/common';
import { ExtApisService } from './ext-apis.service'

@Module({
    imports: [HttpModule],
    providers: [ExtApisService]
})
export class ExternalApisModule {}
