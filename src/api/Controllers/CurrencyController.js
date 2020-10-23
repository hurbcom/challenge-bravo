const CurrencyService = require('../Services/CurrencyService');
const ConvertService = require('../Services/ConvertService');

module.exports = {

    async convert(req, res, next) {
        
    // validators.client(req); // TODO joy
      
         try {
            const response = await ConvertService.convert(req.param);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    },

    async create(req, res, next) {

    //    validators.req(req); // TODO joy

        try {
            const response = await CurrencyService.create(req.body);
            return res.status(201).json(response);
        } catch (e) {
            return next(e);
        }
    },

   async delete(req, res, next) {    

    //validators.req(id);  TODO joy
    
        try {
            const response = await CurrencyService.delete(req.param);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }
};