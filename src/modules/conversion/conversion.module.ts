import { Module } from '@nestjs/common';

import { ConversionService } from './conversion.service';

@Module({
    providers: [ConversionService],
})
export class ConversionModule {}
