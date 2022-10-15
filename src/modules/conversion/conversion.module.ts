import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AwesomeApiService } from '../../libraries/price/price-services/awesome-api.service';

import { ConversionController } from './controllers/conversion.controller';
import { ConversionService } from './services/conversion.service';

@Module({
    imports: [HttpModule],
    providers: [ConversionService, AwesomeApiService],
    controllers: [ConversionController],
})
export class ConversionModule {}
