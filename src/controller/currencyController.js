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
    console.log('test')
    // var data = CurrencyService.getAll();
    return res.status(200).send({ message: "Hello World" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getById (req, res) {
  try {
    // var data = CurrencyService.getById(req.params.id);
    return res.status(200).send({ message: "Hello World" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function create(req, res) {
  try {
    // var data = CurrencyService.create(req.body);
    return res.status(200).send({ message: "Hello World" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateById(req, res) {
  try {
    // var data = CurrencyService.update(req.params.id, req.body);
    return res.status(200).send({ message: "Hello World" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteById(req, res) {
  try {
    // var data = CurrencyService.delete(req.params.id);
    return res.status(200).send({ message: "Hello World" });
  } catch (error) {
    res.status(500).send(error);
  }
}