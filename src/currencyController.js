const express = require("express");
const currencies = ["USD","BRL","EUR","BTC","ETH"];
const { Currency } = require("../models");

exports.ChangeCurrency = async (req, res) => {
    if(!req.query.from || !req.query.to || !req.query.amount){ 
        return res.status(400).json({ Error: "Invalid params"}); 
    }

    if(!currencies.includes(req.query.from)){
        return res.status(400).json({ Error: "Currency 'from' not accepted"}); 
    }

    if(!currencies.includes(req.query.to)){
        return res.status(400).json({ Error: "Currency 'to' not accepted"}); 
    }
};

exports.AddCurrency = async (req, res) => {
    if(!req.query.currency_name || req.query.currency_name.isEmpty){ 
        return res.status(400).json({ Error: "Invalid params"}); 
    }else{
        const searchCurrency = await Currency.findOne({ where: { currency_name: req.query.currency_name }});
        if(searchCurrency != null){
            return res.status(400).json({ Error: "Currency exist"});
        }else{
            await Currency.create({ currency_name: req.query.currency_name }).then(
                res.status(200).json({ Message: "Currency successfully registered" })
            );
        }
    }
};

exports.RemoveCurrency = async (req, res) => {
    return res.json({ message: "Remove Currency Routes" });
};