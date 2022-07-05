const CurrencyService = require("../services/currencyService");

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById
}

async function getAll (req, res) {
  try {
    var data = await CurrencyService.getAll();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getById (req, res) {
  try {
    var data = CurrencyService.getById(req.params.id);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function create(req, res) {
  try {
    var { name, exchange_rate } = req.body;
    var data = await CurrencyService.create(name, exchange_rate);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateById(req, res) {
  try {
    var { name, value } = req.body;
    var data = CurrencyService.update(req.params.id, name, value);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteById(req, res) {
  try {
    var data = CurrencyService.delete(req.params.id);
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}