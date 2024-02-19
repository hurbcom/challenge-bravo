// moeda.module.ts

import { Module } from '@nestjs/common';
import { MoedaController } from './moeda.controller';
import { MoedaService } from './moeda.service';

@Module({
  controllers: [MoedaController],
  providers: [MoedaService],
})
export class MoedaModule {}
