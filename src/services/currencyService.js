import currencyRepository from '../repositories/currencyRepositories.js';
import logger from '../config/logger.config.js';

class CurrencyService{    
    static async getCurrencies () {
        try {
            logger.info('----------> << CURRENCYSERVICE  >> GET ALL DATAS FROM CURRENCY REPOSITORY');

            const result = await currencyRepository.getCurrencies();

            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYSERVICE  >> ${e.message}`) 

            throw e;
        }
    }

    static async getCurrency(code) {
        try {
            logger.info('----------> << CURRENCYSERVICE  >> GET SELECTED DATA FROM CURRENCY REPOSITORY');

            const AlreadyExists = await currencyRepository.getCurrency(code);

            if(!AlreadyExists) { throw new Error('Currency code not exists at database yet') } 

            const result = await currencyRepository.getCurrency(code);

            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYSERVICE  >> ${e.message}`) 

            throw e;
        }
    }

    static async postCurrency(data){
        try {
            logger.info('----------> << CURRENCYSERVICE  >>  INSERT DATA AT DATABASE AND VALIDATE IF ALREADY EXISTS');
            
            const code = data.code;

            const AlreadyExists = await currencyRepository.getCurrency(code);
            
            if(AlreadyExists) { throw new Error('Currency code already exists at database') }

            const result = await currencyRepository.postCurrency(data);
           
            return result;
        } catch (e) {

            logger.error(`############ << CURRENCYSERVICE  >> ${e.message}`) 

            throw e;
        }
    } 

    static async deleteCurrency(code){
        try {
            logger.info('----------> << CURRENCYSERVICE  >> DELETE FROM DATABASE AND VALIDATE IF VALUE ALREADY EXISTS');

            const AlreadyExists = await currencyRepository.getCurrency(code);

            if(!AlreadyExists) { throw new Error('Currency code not exists at database to be deleted') }

            const result = await currencyRepository.deleteCurrency(code);
    
            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYSERVICE  >> ${e.message}`) ;

            throw e;
        }
    }
}

export default CurrencyService;