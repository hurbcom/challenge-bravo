const { json } = require('body-parser');
const { response } = require('express');
const mongoose = require('mongoose');
const moeda = mongoose.model('Moeda');


exports.get = async(typeMoeda) => {

    const query = moeda.find({moeda:typeMoeda}).select('cotacaodolar -_id').lean().exec();

    return query;

}


