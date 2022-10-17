import { Repository } from "typeorm";
import { AppDataSource } from "../../../configs/typeorm.config";
import { CurrencyEntity } from "../entities/currency.entity";

export class CurrencyRepository {

  private currencyRepository: Repository<CurrencyEntity>

  constructor() {
    this.currencyRepository = AppDataSource.getRepository(CurrencyEntity)
  }

  public async create() {

  }

  public async delete() {

  }

  public async findByCode(code: string): Promise<CurrencyEntity> {
    const currency = await this.currencyRepository.findOne({
      where: { code }
    })
    if(!currency) return null
    return currency
  }
}