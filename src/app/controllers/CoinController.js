const Coin = require('../database/schemas/Coin');
const axios = require('axios');


class CoinController {
    //Função que mostra todas as moedas cadastradas no banco
    async index(req, res) {
        const coins = await Coin.find();
        return res.send(coins);
    }
    //Função para criação de moeda
    async store(req, res) {
        const { code, name, lastro } = req.body;

        const coinExists = await Coin.findOne({ code: code});

        if (coinExists) return res.status(400).json({ erro: "Coin already exists." })

        const coin = await Coin.create({
            code,
            name,
            lastro
        });
        return res.json(coin);

    }
    //Função para a atualização da moeda
    async update(req, res) {
        try {
            const coin = await Coin.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.json(coin)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: "Coin does not updated" });
        }
    }
    //Função para deletar uma moeda
    async delete(req, res) {
       //pegando id através dos parametros na requisição
       const { id } = req.params;
       try {
           //removendo do banco a moeda desejada pelo id da mesma.
           await Coin.findByIdAndRemove(id)
           return res.status(200).json();
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: `Error when deleting currency with id: ${id}` });
        }
    }
    //Função que realiza a conversão das moedas
    async conversion(req, res) {
        const {from, to, amount } = req.query;
        //localizando as moedas no banco de dados
        const coinFrom = await Coin.findOne({ code: from })
        const coinTo = await Coin.findOne({ code: to })

        if (!coinFrom) return res.status(400).json({ error: "Coin From does not exists" });
        if (!coinTo) return res.status(400).json({ error: "Coin To does not exists" });


        /* realizando a conversão entre as moedas:
        Converção em que coloco elas no valor do lastro definido como BRL e
        divido pelo valor que será convertido
        */
        const conversion = ( amount * coinFrom.lastro ) / coinTo.lastro;

        return res.json({ value: conversion });
    }
    //Função para atualização dos valores cambiais das moedas automaticamente por api web;
    async updateWEB () {
        try {
            const response = await axios.get('https://economia.awesomeapi.com.br/json/all');
            const data = Object.values(response.data);
            data.forEach(async (coin, index) => {
                try {
                   if (index !== 1){
                        let newCoin = await Coin.updateOne({
                            code: coin.code
                        }, {
                            lastro: Number(coin.high)
                        })
                        return console.log(newCoin)
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            return console.log("Updated");
        } catch (error) {
            console.log(error);
        }
    }
    //Função para criar moedas automaticamente através de api web
    async createWeb () {
        try {
            const response = await axios.get('https://economia.awesomeapi.com.br/json/all');
            const data = Object.values(response.data);
            data.map(async (coin , index) => {
                try {
                    if (index !== 1) await Coin.create({
                        code: coin.code,
                        name: coin.name,
                        lastro: coin.high
                     })
                } catch (error) {
                    console.log(error);
                }
            })
            return console.log("Created Coins");
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new CoinController;