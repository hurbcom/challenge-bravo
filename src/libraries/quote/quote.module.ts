import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';

import { redisConfig } from '../../config/redis.config';

@Module({
    imports: [HttpModule, CacheModule.register(redisConfig())],
    exports: [HttpModule, CacheModule],
})
export class QuoteModule {}
