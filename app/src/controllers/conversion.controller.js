import Status from 'http-status';
import ConversionService from '../services/conversion.service';
import { constants } from '../config';

export default class ConversionController {
    constructor(conversionService) {
        this.service = conversionService || new ConversionService();
        this.referenceCurrency = constants.REFERENCE_CURRENCY;
    }

    convert = async (req, res, next) => {

        try {
            const exchangeRate = await this.service.calculateExchangeRate({ ...req.query, reference: this.referenceCurrency });

            return res.status(Status.OK).json(exchangeRate);
        } catch (e) {
            return next(e);
        }
    };
}