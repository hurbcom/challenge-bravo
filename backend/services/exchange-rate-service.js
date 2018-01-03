import axios from 'axios';
import moment from 'moment';

import { throttleAdapterEnhancer } from 'axios-extensions';

const http = axios.create({
	baseURL: '/',
	headers: { 'Cache-Control': 'no-cache' },
	adapter: throttleAdapterEnhancer(axios.defaults.adapter, 10 * 1000)//10 seconds cache
});

class ExchangeRateService {

  constructor(){
  }

  getCurrencyExchangeRate(currencies){
    return http.get('https://openexchangerates.org/api/latest.json',
    {
      params : {
        "app_id" : process.env.oerAppId,
        "symbols" : "USD,BRL,EUR,BTC,ETH",
				"show_alternative" : 1
      }
    })
    .then(response => {
      return response.data.rates;
    })
    .catch(errors => {
    	throw new Error('Invalid Api Id', errors.response.status);
    });
  }
}

export default ExchangeRateService;
