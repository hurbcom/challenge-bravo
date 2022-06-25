import currencyService from '../services/currencyService.js';
import currency_validator from "../validators/validate_currency.js";
import logger from '../config/logger.config.js';

class CurrencyController{
    static async getCurrencies (req, res) {
        try {
            logger.info('----------> <<< CURRENCYCONTROLLER >>> DELIVERY ALL THE DATAS FROM SERVICE TO CLIENT');

            const result = await currencyService.getCurrencies();

            return res.status(200).json(result);
        } catch (e) {
            logger.error(`############ <<< CURRENCYCONTROLLER >>> ${e.message}`);
            
            res.status(500).json({ error: e.message });
        }
    }

    static async getCurrency(req, res) {
        try {
            logger.info('----------> <<< CURRENCYCONTROLLER >>> getCurrency DELIVERY A SELECTED DATA FROM SERVICE TO CLIENT');

            const params = req.params.code;

            const result = await currencyService.getCurrency(params);

            return res.status(200).json(result);
        } catch (e) {
            logger.error(`############ <<< CURRENCYCONTROLLER >>> ${e.message}`);
            
            res.status(500).json({ error: e.message });
        }
    }

    static async postCurrency (req, res) {
        try{
            logger.info('----------> <<< CURRENCYCONTROLLER >>> PICK UP DE DATAS FROM CLIENT AND SEND TO SERVICE');
            
            const data = req.body;
            
            await currency_validator.validate(data);

            const result = await currencyService.postCurrency(data);

            res.json(result);
        } catch(e){
            logger.error(`############ <<< CURRENCYCONTROLLER >>> ${e.message}`);

            res.status(500).json({ error: e.message });
        }
    }

    static async deleteCurrency (req, res) {
        try{

            logger.info('----------> <<< CURRENCYCONTROLLER >>> PICK UP BY PARAMS AND SEND THE REQUEST TO DELETE TO SERVICE');

            const params = req.params.code;
            
            const result = await currencyService.deleteCurrency(params);
            
            return res.status(200).json(result);
        } catch(e){
            logger.error(`############ CURRENCYCONTROLLER ${e.message}`);
            
            res.status(500).json({ error: e.message });
        }
    }
}

export default CurrencyController;