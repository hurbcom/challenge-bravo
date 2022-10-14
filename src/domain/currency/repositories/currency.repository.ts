import { BaseRepository } from '../../@shared/repository/base.repository';
import { Currency } from '../entities/currency.entity';

export interface CurrencyRepository extends BaseRepository<Currency> {
  findByCurrencyCode(code: string): Promise<Currency>
}