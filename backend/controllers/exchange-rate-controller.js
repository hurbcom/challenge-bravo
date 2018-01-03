import ExchangeRateService from '../services/exchange-rate-service'

class ExchageRateController {

  constructor(){
    this.exchangeRateService = new ExchangeRateService();
  }

  getCurrencyExchangeRate(convert){
    return this.exchangeRateService.getCurrencyExchangeRate(convert).
    then( rates => {
      let dolarAmount = +convert.amount / rates[convert.from];
      let convertedAmount = dolarAmount * rates[convert.to]

      return { convertedAmount : convertedAmount };
    });
  }
}

export default ExchageRateController
