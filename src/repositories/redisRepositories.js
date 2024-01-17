const dotenv = require('dotenv');

const redis = require('../../config/redis/redis');
dotenv.config();

const insertRedisData = async (currencyCode, currencyTax) => {
    await redis.set(currencyCode, currencyTax, "EX", 300);
    console.log("Sucess Insert on Redis");
};

const getRedisDataOriginal = async (currencyCode) => {
    const value = await redis.get(currencyCode);
    if (value) {
      console.log("Valor existe",value);      
      return value;
    }else{
      return false;
    }
};

const getRedisDataComparative = async (currencyCode) => {
  const value = await redis.get(currencyCode);
  if (value) {
    console.log("Valor existe",value);    
    return value;
  }else{
    return false;
  }
};

module.exports = {
  insertRedisData,
  getRedisDataOriginal,
  getRedisDataComparative
};