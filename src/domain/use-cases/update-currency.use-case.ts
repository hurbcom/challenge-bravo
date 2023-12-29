import { CurrencyEntityProps } from '../entities/currency.entity';
import CurrencyRepository from '../repositories/currency.repository';

export default class UpdateCurrencyUseCase {
  constructor(private readonly currencyRepository: CurrencyRepository) { }

  async execute(body: any): Promise<CurrencyEntityProps | null> {
    const currencyResponse = await this.currencyRepository.findBy({
      code: body.code,
    });    
      if(currencyResponse){
        const currency = currencyResponse[0]; 
        const updatedCurrency = await this.currencyRepository.update(currency);
  
        return updatedCurrency.props;
      }
    return null
  }
}
