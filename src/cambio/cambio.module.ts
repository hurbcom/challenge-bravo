import { Module } from '@nestjs/common';
import { CambioService } from './cambio.service';
import { CambioController } from './cambio.controller';

@Module({
    providers: [CambioService],
    controllers: [CambioController],
})
export class CambioModule {}