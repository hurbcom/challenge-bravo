import currencyModel from '../models/currencyModel';
import converterService from '../services/converterService';

module.exports = {

    async index(req, res) {
        const { from, to, amount } = req.query;

        const currencyFrom = await currencyModel.findOne({
            where: {
                initials: from
            }
        })

        if (!currencyFrom) {
            throw { msg: "Moeda ${from} não cadastrada" };
        }

        const currencyTo = await currencyModel.findOne({
            where: {
                initials: to
            }
        });

        if (!currencyTo) {
            throw { msg: "Moeda ${from} não cadastrada" };
        }

        const response = await converterService.makeConversion(currencyFrom, currencyTo, amount);

        return res.status(200).json({ 
            response: "${to} ${response}" 
        });
    }

}
