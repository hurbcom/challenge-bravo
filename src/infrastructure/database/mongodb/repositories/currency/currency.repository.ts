import { PrismaClient } from '@prisma/client';
import { Currency } from '../../../../../domain/currency/entities/currency.entity';
import { CurrencyRepository } from '../../../../../domain/currency/repositories/currency.repository';

export class MongoCurrencyRepository implements CurrencyRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async findByCurrencyCode(code: string): Promise<Currency | null> {
    const result = await this.prismaClient.currency.findUnique({
      where: {
        code
      }
    });
    if (!result) return null;
    return new Currency(
      result.code,
      result.unitCost,
      result.backingCurrency,
      result.id
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

  async deleteByCurrencyCode(code: string): Promise<void> {
    await this.prismaClient.currency.delete({
      where: {
        code
      }
    });
  }
}