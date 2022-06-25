import CurrencyModel from '../models/model_currency.js';
import logger from '../config/logger.config.js';

class CurrencyRepository {
    static async getCurrencies() {
        try {
            logger.info('----------> CURRENCYREPOSITORY  TAKE ALL DATAS FROM DATABASE');
            
            const result = await CurrencyModel.find();
            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYREPOSITORY  >> ${e.message}`);

            throw e;
        }
    }
    
    static async getCurrency(code) {
        try {

            logger.info('----------> << CURRENCYREPOSITORY  >> TAKE JUST ONE SELECTED DATA FROM DATABASE');
            const query = { code: code }
    
            const result = await CurrencyModel.findOne(query);
            return result;
        } catch (e) {

            logger.error(`############ << CURRENCYREPOSITORY  >> ${e.message}`);

            throw e;
        }
    }
    
    static async postCurrency(body) {
        try {

            logger.info('----------> << CURRENCYREPOSITORY  >>  JUST INSERT DATA AT DATABASE');

            const data = await CurrencyModel(body);
    
            const result = await data.save();
        
            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYREPOSITORY  >> ${e.message}`); 

            throw e;
        }
    }

    static async updateCurrency(code, rate) {
        try {

            logger.info('----------> << CURRENCYREPOSITORY  >>  JUST UPDATE - WITHOUT PATCH METHOD - DATA AT DATABASE ');

            const query = { code: code }
    
            const data = await CurrencyModel.findOne(query);
    
            data.rate = rate;
    
            const result = await data.save();
         
            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYREPOSITORY  >> ${e.message}`);

            throw e;
        }
    }

    static async deleteCurrency(code) {
        try {

            logger.info('----------> << CURRENCYREPOSITORY  >>  JUST REMOVE A DATA FILTER BY CODE');

            const query = { code: code }

            const result = await CurrencyModel.deleteOne(query);
   
            return result;
        } catch (e) {
            logger.error(`############ << CURRENCYREPOSITORY  >> ${e.message}`);
            
            throw e;
        }
    }
}

export default CurrencyRepository;