import { addHours } from 'date-fns';

import { IDateProvider } from '../models/IDateProvider';

export class DateFnsProvider implements IDateProvider {
  public addHours(date: Date, amount: number): Date {
    return addHours(date, amount);
  }
}
