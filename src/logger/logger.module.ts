import { Module} from '@nestjs/common';
import { KitLogger } from './services';;

@Module({
  providers: [KitLogger],
  exports: [KitLogger],
})

export class LoggerModule {}
