import { container } from 'tsyringe';

import { DateFnsProvider } from './implementations/DateFnsProvider';
import { IDateProvider } from './models/IDateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateFnsProvider);
