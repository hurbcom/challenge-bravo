const Coins = require('../models/coins');

const getOriginCoin = async (coin) => {

    const response = await Coins.findOne({code: coin});
    return response
};

const getComparativeCoin = async (coin) => {

    const response = await Coins.findOne({code: coin});
    return response
};

const checkInsertPermission = async (coin) => {
    const response = await Coins.findOne({code: coin});
    return response
}

const insertCoin = async (code, name, value) => {

    const checkCoinOnDB = coinsRepositories.checkInsertPermission(code);
    if (checkCoinOnDB) {
        const response = new Coins({code, name, value});
        await response.save();   
        return response;         
    }else{
        
    }         
}

const updateCoin = async (code, name, value) => {
    const filter = { code: code };
    const update = {
      $set: { code:code, name:name, value: value},
    };
    const response = await Currency.updateOne(filter, update, { upsert: true });

    return response;    
}
module.exports = {
    getOriginCoin,
    getComparativeCoin,
    checkInsertPermission,
    insertCoin,
    updateCoin
}
