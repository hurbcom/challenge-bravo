import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as uuid from 'uuid';
import { Currency } from '../models';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency)
    private currencyModel: typeof Currency,
  ) {}

  public async findAll(): Promise<Currency[]> {
    return this.currencyModel.findAll();
  }

  public async findOneByName(currencyName: string): Promise<Currency> {
    return this.currencyModel.findOne({
      where: {
        name: currencyName,
      },
    });
  }

  public async insert(currencyName: string): Promise<Currency> {
    let currency = await this.findOneByName(currencyName);
    if (!currency) {
      currency = await this.currencyModel.create({
        id: uuid.v4(),
        name: currencyName,
      });
    }

    return currency;
  }

  public async removeByName(currencyName: string): Promise<void> {
    const currency = await this.findOneByName(currencyName);
    if (currency) {
      await currency.destroy();
    }
  }
}
