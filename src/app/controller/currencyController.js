const express = require("express");
const CurrencyService = require("../services/currencyService");

exports.getAll = function(req, res) {
  try {
    var data = CurrencyService.getAll();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getById = function(req, res) {
  try {
    var data = CurrencyService.getById(req.params.id);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.create = function(req, res) {
  try {
    var data = CurrencyService.create(req.body);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.update = function(req, res) {
  try {
    var data = CurrencyService.update(req.params.id, req.body);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.delete = function(req, res) {
  try {
    var data = CurrencyService.delete(req.params.id);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}
