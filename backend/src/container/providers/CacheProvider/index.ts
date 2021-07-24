import { container } from 'tsyringe';

import { RedisProvider } from './implementations/RedisProvider';
import { ICacheProvider } from './models/ICacheProvider';

container.registerSingleton<ICacheProvider>('CacheProvider', RedisProvider);
