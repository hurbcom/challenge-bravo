const express = require("express");
const ConversionService = require("../services/conversionService");

exports.getAll = function(req, res) {
  try {
    var data = ConversionService.getAll();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}
