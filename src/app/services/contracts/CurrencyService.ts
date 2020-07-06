import Currency, { ICurrency } from '../../models/Currency';
import { injectable } from 'inversify';

@injectable()
export default abstract class CurrencyService {
  abstract async findById(id: number): Promise<Currency | null>;
  abstract async findBySymbol(symbol: string): Promise<Currency | null>;
  abstract async index(): Promise<Currency[]>;
  abstract async create(data: any): Promise<Currency | Currency[]>;
  abstract async delete(id: number): Promise<boolean>;
}