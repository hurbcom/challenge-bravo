import { DeleteResult, Repository } from "typeorm";
import { AppDataSource } from "../../../configs/typeorm.config";
import { CreateCurrencyRequestDTO } from "../dtos/create-currency.dto";
import { CurrencyEntity } from "../entities/currency.entity";

export class CurrencyRepository {

  private currencyRepository: Repository<CurrencyEntity>

  constructor() {
    this.currencyRepository = AppDataSource.getRepository(CurrencyEntity)
  }

  public async create(data: CreateCurrencyRequestDTO): Promise<CurrencyEntity> {
    const newCurrency = await this.currencyRepository.save({ ...data })
    if(!newCurrency) return null
    return newCurrency
  }

  public async deleteByCode(code: string): Promise<Boolean> {
    const deleteCurrencyResponse = await this.currencyRepository.delete({ code })
    if(deleteCurrencyResponse.affected < 1) return null
    return true
  }

  public async findByCode(code: string): Promise<CurrencyEntity> {
    const currency = await this.currencyRepository.findOne({
      where: { code }
    })
    if(!currency) return null
    return currency
  }
}