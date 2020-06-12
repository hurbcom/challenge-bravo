const Coin = require('../schemas/Coin');
const axios = require('axios');


class CoinController {
    async index(req, res) {
        const coins = await Coin.find();
        return res.send(coins);
    }
    async store(req, res) {
        const { code, name, lastro } = req.body;
        const coin = await Coin.create({
            code,
            name,
            lastro
        });
        return res.json(coin);

    }
    async update(req, res) {

    }
    async delete(req, res) {

    }
    async conversion(req, res) {
        const {from, to, amount } = req.query;
        //localizando as moedas no banco de dados
        const coinFrom = await Coin.findOne({ code: from })
        const coinTo = await Coin.findOne({ code: to })
        /* realizando a conversão entre as moedas:
        Converção em que coloco elas no valor do lastro definido como BRL e
        divido pelo valor que será convertido
        */
        const conversion = ( amount * coinFrom.lastro ) / coinTo.lastro;

        return res.json({ value: conversion });
    }


    //Função para atualização dos valores cambiais das moedas automaticamente;
    async updateWEB (req, res) {
        const response = await axios.get('https://economia.awesomeapi.com.br/json/all');
        const data = Object.values(response.data);
        data.map(async (coin) => {
            try {
               const newCoin = await Coin.updateOne({code: coin.code}, { lastro: Number(coin.high) })
               console.log(newCoin)
            } catch (error) {
                console.log(error);
            }
        })
        console.log("Updated");
    }
}

module.exports = new CoinController;