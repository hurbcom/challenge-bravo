const { json } = require('body-parser');
const { response } = require('express');
const mongoose = require('mongoose');
const moeda = mongoose.model('Moeda');


exports.get = async(typeMoeda) => {

  const moedacreated = new moeda(typeMoeda);
  await moedacreated.save();

}

exports.delete = async() => {
  return moeda
  .deleteMany();
}
