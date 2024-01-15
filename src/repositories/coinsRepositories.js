const Coins = require('../models/coins');

const getOriginCoin = async (coin) => {
    console.log(coin)
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
    const response = new Coins({code, name, value});
    await response.save();   
    return response;           
}

const updateCoin = async (code, name, value) => {
    const filter = { code: code };
    const update = {
      $set: { code:code, name:name, value: value},
    };
    const response = await Coins.updateOne(filter, update, { upsert: true });

    return response;    
}

const deleteCoin = async (code) => {
    const result = await Coins.deleteOne({code: code});     

    return result;
}

module.exports = {
    getOriginCoin,
    getComparativeCoin,
    checkInsertPermission,
    insertCoin,
    updateCoin,
    deleteCoin
}
