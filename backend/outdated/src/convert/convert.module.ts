import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';

@Module({
  providers: [ConvertService]
})
export class ConvertModule {}
