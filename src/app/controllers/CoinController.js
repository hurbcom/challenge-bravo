const knex = require('../../database/connection');
const axios = require('axios');


class CoinController {
    //Função que mostra todas as moedas cadastradas no banco
    async index(req, res) {
        const coins = await knex('coins').select('*');
        return res.send(coins);
    }
    //Função para criação de moeda
    async store(req, res) {
        const { code, name, lastro } = req.body;

        const coinExists = await knex('coins').where('code',code).first();

        if (coinExists) return res.status(400).json({ erro: "Coin already exists." })

        const newCoin = {
            code,
            name,
            lastro
        }

        await knex('coins').insert(newCoin);
        return res.json(newCoin);
    }
    //Função para a atualização da moeda
    async update(req, res) {
        try {
            const coin = await knex('coins').where('id',req.params.id).update(req.body);
            if (coin === 0 ) return res.status(400).json({ error: "Coin does not updated" });
            return res.json(req.body)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: "Coin does not updated" });
        }
    }
    //Função para deletar uma moeda
    async delete(req, res) {
       //pegando id através dos parametros na requisição
       try {
           //removendo do banco a moeda desejada pelo id da mesma.
           await knex('coins')
               .where('id', req.params.id)
               .del()
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
        const coinFrom = await knex('coins').where({ code: from }).first();
        const coinTo = await knex('coins').where({ code: to }).first();

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
            const response = await axios.get(process.env.API_ECONOMIA);
            const data = Object.values(response.data);
            data.forEach(async (coin, index) => {
                try {
                   if (index !== 1){
                        let newCoin = await knex('coins')
                            .where('code', coin.code)
                            .update({ lastro : Number(coin.high) })
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
}

module.exports = new CoinController;