const express = require("express");
const { Currency } = require("../models");
const currency = require("../models/currency");
const apiService = require("../services/apiService");


exports.ChangeCurrency = async (req, res) => {
    if(!req.query.from || !req.query.to || !req.query.amount){ 
        return res.status(400).json({ Error: "Invalid params"}); 
    }
    
    const currencies = await Currency.findAll({attributes: ['currency_name'], raw : true}).then( currencies => { return currencies.map( currency => { return currency.currency_name })} );
    if(!currencies.includes(req.query.from)){
        return res.status(400).json({ Error: "Currency 'from' not accepted"}); 
    }

    if(!currencies.includes(req.query.to)){
        return res.status(400).json({ Error: "Currency 'to' not accepted"}); 
    }

    apiService.ConvertCurrency(req.query).then( response => { 
        return res.status(200).json({
            "result": response.data.result, 
            "query": response.data.query
        });
    });

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
    if(!req.query.currency_name || req.query.currency_name.isEmpty){ 
        return res.status(400).json({ Error: "Invalid params"}); 
    }else{
        const deleted = await Currency.destroy({ where: { currency_name: req.query.currency_name }});
        if (deleted != 0) { 
            return res.status(200).json({ Success: "Currency deleted" }); 
        }else{
            return res.status(400).json({ Error: "Currency not found" });
        }
    }
};