import { PrismaClient } from '@prisma/client';
import { Currency } from '../../../../domain/currency/entities/currency.entity';
import { CurrencyRepository } from '../../../../domain/currency/repositories/currency.repository';

export class MongoCurrencyRepository implements CurrencyRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async findByCurrencyCode(code: string): Promise<Currency> {
    const result = await this.prismaClient.currency.findFirst({
      where: {
        code
      }
    });
    if (!result) throw new Error('Not Found');
    return new Currency(
      result.code,
      result.unitCost,
      result.id, 
      result.backingCurrency
    );
  }
  async create(entity: Currency): Promise<void> {
    await this.prismaClient.currency.create({
      data: {
        id: entity.id,
        backingCurrency: entity.backingCurrency,
        code: entity.code,
        unitCost: entity.unitCost
      }
    });
  }    
}