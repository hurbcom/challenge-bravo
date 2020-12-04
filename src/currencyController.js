const express = require("express");

exports.ChangeCurrency = (req, res) => {
    // return res.status(200).json({message: "Change Currency Routes"});
};

exports.AddCurrency = async (req, res) => {
    return res.json({message: "Add Currency Routes"});
};

exports.RemoveCurrency = async (req, res) => {
    return res.json({message: "Remove Currency Routes"});
};