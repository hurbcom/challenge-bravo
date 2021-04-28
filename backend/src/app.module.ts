import { Module } from '@nestjs/common';
import { ConvertModule } from './convert/convert.module';

@Module({
  imports: [ConvertModule],
})
export class AppModule {}
