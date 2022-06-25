import verifyIfNeedUpdate from '../utils/currencyUpdate.js';
import logger from '../config/logger.config.js';;
import currencyRepository from '../repositories/currencyRepositories.js';

class ExchangeService{
   static async exchangeService([from, to, rate]){
       try {

           logger.info('----------> <<< EXCHANGESERVICE >>> >>> VALIDATE IF THE VALUES ARE EQUALS OR VALID');

           const dataFrom = await currencyRepository.getCurrency(from);

           if(!dataFrom) throw new Error('Field FROM does not exists in the database') 
    
           const dataTo = await currencyRepository.getCurrency(to);
   
           if (!dataTo) throw new Error('Field TO does not exists in the database')

           if(!rate) throw new Error('Field RATE cannot be 0')
           
           const finalValue = await this.dataProcessing(dataFrom, dataTo, rate);
           
           const result = { 
               from: from,
               to: to,
               rate: `${to} : ${finalValue} `
           }

           return result
       } catch (e) {
           logger.error(`############ <<< EXCHANGESERVICE >>> ${e.message}`)   
           throw e;
       }
   }

   static async dataProcessing(dataTo, dataFrom, rate) {

       logger.info('----------> <<< EXCHANGESERVICE >>> VerifyIfNeedUpdate: CONVERT DE DATAS BETWEEN FLOAT <-> NUMBER');
       try {    
           const {
               returnedRateValueFrom,
               returnedRateValueTo
           } = await verifyIfNeedUpdate.exchange(dataTo, dataFrom);

           const finalValue = ((rate * returnedRateValueFrom) / returnedRateValueTo).toFixed(2);

           return finalValue;
       } catch (e) {
           logger.error(`############ <<< EXCHANGESERVICE >>> ${e.message}`)  
           throw e;
       }
   }
}

export default ExchangeService;
