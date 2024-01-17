const CoinsProd = require('../models/coinsProd');
const CoinsTest = require('../models/coinsTest');


const getOriginCoin = async (coin, env) => {
    if (env === "PROD") {
        const response = await CoinsProd.findOne({code: coin});    
        return response;
    }else if (env === "TEST") {
        const response = await CoinsTest.findOne({code: coin});    
        return response;
    }else{
        return 400;
    }
    
};

const getComparativeCoin = async (coin, env) => {

    if (env === "PROD") {
        const response = await CoinsProd.findOne({code: coin});
        return response;
    }else if (env === "TEST") {
        const response = await CoinsTest.findOne({code: coin});
        return response;
    }else{
        return 400;
    }   

};

const checkInsertPermission = async (coin, env) => {
    if (env === "PROD") {
        const response = await CoinsProd.findOne({code: coin});
        return response;
    }else if (env === "TEST") {
        const response = await CoinsTest.findOne({code: coin});
        return response;
    }else{
        return 400;
    }   
}

const insertCoin = async (code, name, value, env) => {    
    
    if (env === "PROD") {
        const response = new CoinsProd({code, name, value});
        await response.save();   
        return response;     
    }else if (env === "TEST") {
        const response = new CoinsTest({code, name, value});
        await response.save();   
        return response;     
    }else{
        return 400;
    }        
}

const updateCoin = async (code, name, value, env) => {

    if (env === "PROD") {
        const filter = { code: code };
        const update = {
          $set: { code:code, name:name, value: value},
        };
        const response = await CoinsProd.updateOne(filter, update, { upsert: true });
    
        return response;    
    }else if (env === "TEST") {
        const filter = { code: code };
        const update = {
          $set: { code:code, name:name, value: value},
        };
        const response = await CoinsTest.updateOne(filter, update, { upsert: true });
    
        return response;    
    }else{
        return 400;
    }            
}

const deleteCoin = async (code, env) => {

    if (env === "PROD") {
        const result = await CoinsProd.deleteOne({code: code});     
        return result;
    }else if (env === "TEST") {
        const result = await CoinsTest.deleteOne({code: code});     
        return result;   
    }else{
        return 400;
    }       

}

module.exports = {
    getOriginCoin,
    getComparativeCoin,
    checkInsertPermission,
    insertCoin,
    updateCoin,
    deleteCoin
}
