// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CambioModule } from './cambio/cambio.module';
import { MoedaController } from './moeda/moeda.controller';
import { MoedaModule } from './moeda/moeda.module';

@Module({
  imports: [CambioModule, MoedaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
