import 'reflect-metadata';
import bigjs from 'big.js'
import { container } from 'tsyringe';
import { CurrencyPriceService } from '../../../../external-currency-api/services/currency-price.service';
import { CurrencyConversionRequestDTO, CurrencyConversionResponseDTO } from "../dtos/currency-conversion.dto";
import { CurrencyRepository } from '../../../repository/currency.repository';
import { apiConfigs } from '../../../../../configs/api.config';
import { CacheService } from '../../../../cache/cache.service';

export class CurrencyConversionService {

  public async execute(data: CurrencyConversionRequestDTO): Promise<CurrencyConversionResponseDTO> {
    const fromCurrencyUnitCost = await this.findCurrencyUnitCostByCode(data.from)
    const toCurrencyUnitCost = await this.findCurrencyUnitCostByCode(data.to)
    const conversionPrice = await this.converCurrenciesUnitCosts(fromCurrencyUnitCost, toCurrencyUnitCost, data.amount)
    return { value: conversionPrice }
  }

  private async findCurrencyUnitCostByCode(code: string): Promise<string> {
    if(code === apiConfigs.backeCurrency.code) return '1'

    const currencyPriceService = container.resolve(CurrencyPriceService)
    const currencyRepository = container.resolve(CurrencyRepository)
    const cacheService = container.resolve(CacheService)

    const cacheSearch = await cacheService.getRedisCache(code)
    if(cacheSearch) return cacheSearch

    const localCurrencySearch = await currencyRepository.findByCode(code)
    const externalApiCurrencySearch = await currencyPriceService.execute(code, apiConfigs.backeCurrency.code) 
    if(!localCurrencySearch && !externalApiCurrencySearch) throw new Error(`Was not possible to find currency by the code ${code} in database or external API`)
    
    const currencyUnitCost = externalApiCurrencySearch?.bid || localCurrencySearch?.unitCost
    await cacheService.setRedisCache(code, currencyUnitCost)

    return currencyUnitCost
  }

  private async converCurrenciesUnitCosts(fromUnitCost: string, toUnitCost: string, amount: string): Promise<string> {
    return new bigjs(fromUnitCost)
    .times(amount)
    .div(toUnitCost)
    .round(2)
    .valueOf();
  }
}
