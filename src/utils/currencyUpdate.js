import axios from 'axios';
import logger from '../config/logger.config.js';
import currencyRepository from '../repositories/currencyRepositories.js';

class VerifyIfNeedUpdate{
    static async exchange(dataFrom, dataTo) {
        try{    
            logger.info('----------> << CURRANCYUPDATE >> RETURNING DATAS RATE FROM DATABASE OR FROM EXTERNAL API ');

            const returnedRateValueFrom = await this.updateOrTake(dataFrom);
            const returnedRateValueTo = await this.updateOrTake(dataTo);

            return { returnedRateValueFrom, returnedRateValueTo }
        } catch(e) {
            logger.error(`############ << CURRANCYUPDATE >> ${e.message}`)   
            throw e;
        }    
    }

    static async updateOrTake(data) {
        try{
            
            logger.info(`----------> << CURRANCYUPDATE >> CHECKING IF NEED BE UPDATED OR PICK THE VALUE FROM DATABASE`);

            let rate = data.rate;
            const IsFiat = data.fiatOrFic;

            if(data.code == 'USD') { return rate; }

            if (IsFiat) {
                rate = await this.updateValue(data.code);
            }

            return rate;
        } catch(e) {
            logger.error(`############ << CURRANCYUPDATE >> ${e.message}`)   
            throw e;
        }
    }

    static async updateValue(code){
        try{    

            logger.info('----------> << CURRANCYUPDATE >> UPDATE IN THE DATABASE BY PARAMETER '); 

            const updatedValue = await this.parseValue(code);

            currencyRepository.updateCurrency(code, updatedValue);

            return updatedValue;
        } catch(e) {
            logger.error(`############ << CURRANCYUPDATE >> ${e.message}`)   
            throw e;
        }
    }

    static async getExternalAPI(code){
        try {

            logger.info('----------> << CURRANCYUPDATE >> REQUEST FROM EXTERNAL API TO UPDATE RATE VALUES AT REALTIME');

            const url = `https://economia.awesomeapi.com.br/last/${code}-USD`;
    
            const result = await axios.get(url);
    
            return result.data;
        } catch (e) {
            logger.error(`############ << CURRANCYUPDATE >> ${e.message}`)   
            throw e;
            
        }
    }

    static async parseValue(code) {
        try {

            logger.info('----------> << CURRANCYUPDATE >> PICK THE VALUES FROM API EXTERNALS AND PARSE TO FLOAT THE VALUES');

            const result = await this.getExternalAPI(code);
    
            const newRateParsed = parseFloat(result[`${code}USD`].bid);

            return newRateParsed;

        } catch (e) {      
            logger.error(`############ << CURRANCYUPDATE >> ${e.message}`)     
            throw e;
        }
    }

}

export default VerifyIfNeedUpdate;
