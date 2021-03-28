const Currency = require("../model/currencyModel");
const logger = require("../util/logger");

const find = async () => {
    logger.info(`[CURRENCY REPOSITORY] Retreiving all Currencies`);
    return await Currency.find();
};

const findOne = async (symbol) => {
    logger.info(`[CURRENCY REPOSITORY] Retreiving Currency - ${symbol}`);
    return await Currency.findOne({ symbol });
};

const store = async (currency) => {
    logger.info(
        `[CURRENCY REPOSITORY] Inserting Currency - ${currency.symbol}`
    );
    return await Currency.create(currency);
};

const remove = async (symbol) => {
    logger.info(`[CURRENCY REPOSITORY] Deleting Currency - ${symbol}`);
    return await Currency.deleteOne({ symbol });
};

module.exports = {
    find,
    findOne,
    store,
    remove,
};
