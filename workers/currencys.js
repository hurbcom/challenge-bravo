require('dotenv').config();

const axios = require('axios');
const redis = require("redis");
const { CurrencysModel } = require('../models/currencys');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const getBallastDefault = async () => {
    try {
        const { data } = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.min.json`);
        return data.usd;
    } catch (error) {
        throw new Error(error);
    }
}

const setCurrencyRedis = async (currency, ballast_usd) => {
    try {
        const redisClient = redis.createClient({
            url: process.env.REDIS_HOST_TLS,
            password: process.env.REDIS_PASSWORD_TLS
        });

        await redisClient.connect();
        
        
        await redisClient.set(currency, ballast_usd);

        await redisClient.disconnect();
    } catch (error) {
        throw new Error(error);
    }
};

const handler = async () => {
    while (true) {
        try {
            console.log('>> CONSULTANDO DADOS E ATUALIZANDO DATABASE');

            const ballastDefault = await getBallastDefault();
            const currencys = Object.keys(ballastDefault);
            const countDataInDB = await CurrencysModel.findAll();
            if(countDataInDB.length === 0) {
                console.log('>>> POPULATE DATABASE');
                for (let i = 0; i < currencys.length; i++) {
                    const currency = currencys[i];
                    await CurrencysModel.create({ 
                        currency: currency.toUpperCase(), 
                        ballast_usd: ballastDefault[currency], 
                        createdAt: new Date(), 
                        updatedAt: new Date() 
                    });
                }
                console.log('>>> POPULATE DATABASE COMPLETED');
            } else {
                console.log('>>> UPDATE');
                for (let i = 0; i < currencys.length; i++) {
                    const currency = currencys[i];
                    await CurrencysModel.update({ 
                        ballast_usd: ballastDefault[currency], 
                        updatedAt: new Date() 
                    }, { where: { currency: currency.toUpperCase() } });
                }
                console.log('>>> UPDATE COMPLETED');
            }

            console.log('>> UPDATE REDIS DATABASE');
            const currencysInDB = await CurrencysModel.findAll();
            for (let i = 0; i < currencysInDB.length; i++) {
                const currency = currencysInDB[i];
                await setCurrencyRedis(currency.currency, currency.ballast_usd);
            }
            console.log('>> UPDATE REDIS DATABASE COMPLETED');
        } catch (error) {
            console.error('>> ERRO AO CONSULTAR DADOS', error);
        }

        console.log()
        await sleep(300 * 1000);
    }
};

handler();