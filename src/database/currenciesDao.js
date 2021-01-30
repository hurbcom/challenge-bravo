const CurrenciesModel = require("../models/currenciesModel");

const save = async (currency) => {
    try {
        const newModel = new CurrenciesModel(currency);
        return await newModel.save();
    } catch (error) {
        console.error(error);
        throw new Error(`Error - ${error.message}`);
    }
};

const updateOne = async (where, set) => {
    try {
        return await CurrenciesModel.updateOne(where, set).exec();
    } catch (error) {
        console.error(error);
        throw new Error(`Error - ${error.message}`);
    }
};

const find = async (where, options) => {
    try {
        return await CurrenciesModel.find(where, options).exec();
    } catch (error) {
        console.error(error);
        throw new Error(`Error - ${error.message}`);
    }
};

const findOneAndDelete = async (where) => {
    try {
        return await CurrenciesModel.findOneAndDelete(where).exec();
    } catch (error) {
        console.error(error);
        throw new Error(`Error - ${error.message}`);
    }
};

const findOne = async (where) => {
    try {
        return await CurrenciesModel.findOne(where).exec();
    } catch (error) {
        console.error(error);
        throw new Error(`Error - ${error.message}`);
    }
};

module.exports = { save, updateOne, find, findOne, findOneAndDelete };
