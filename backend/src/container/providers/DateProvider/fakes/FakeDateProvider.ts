import { IDateProvider } from '../models/IDateProvider';

export class FakeDateProvider implements IDateProvider {
  public addHours(date: Date, amount: number): Date {
    return new Date(date.getTime() + amount * (60 * 60 * 1000));
  }
}
