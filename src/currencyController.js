const express = require("express");
const currencies = ["USD","BRL","EUR","BTC","ETH"];

exports.ChangeCurrency = async (req, res) => {
    if(!req.query.from || !req.query.to || !req.query.amount){ 
        return res.status(400).json({ Error: "Invalid params"}); 
    }

    if(!currencies.includes(req.query.from)){
        return res.status(400).json({"Error": "Currency 'from' not accepted"}); 
    }

    if(!currencies.includes(req.query.to)){
        return res.status(400).json({"Error": "Currency 'to' not accepted"}); 
    }
};

exports.AddCurrency = async (req, res) => {
    return res.json({message: "Add Currency Routes"});
};

exports.RemoveCurrency = async (req, res) => {
    return res.json({message: "Remove Currency Routes"});
};