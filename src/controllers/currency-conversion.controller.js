import { currencyLayerConvert } from '../services/currencylayer.service';
import { openExchangeratesConvert } from '../services/openexchangerates.service';
import { coinmarketcapConvert } from '../services/coinmarketcap.service';

// eslint-disable-next-line import/prefer-default-export
export const convert = async (req, res) => {
    const { query } = req;

    if (!query.from) {
        res.statusCode = 417;
        res.send({ message: 'Bad request: missing paramentreo FROM in query' });
        return;
    };

    if (!query.to) {
        res.statusCode = 417;
        res.send({ message: 'Bad request: missing paramentreo TO in query' });
        return;
    };

    if (!query.amount) {
        res.statusCode = 417;
        res.send({ message: 'Bad request: missing paramentreo AMOUNT in query' });
        return;
    };

    const currencyLayerResult = await currencyLayerConvert();
    const openExchangeratesResult = await openExchangeratesConvert();
    const coinmarketcapResult = await coinmarketcapConvert();

    res.json({ currencyLayerResult, openExchangeratesResult, coinmarketcapResult });
};
