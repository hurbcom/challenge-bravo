const mongoose = require('mongoose');
const moeda = mongoose.model('Moeda');

exports.get = async(data) => {
    const res = moeda.find({});
    return res;
 }

 exports.post = async(data) => {
    const moedacreated = new moeda(data);
    await moedacreated.save();
}

 exports.delete = async(nome) => {
    return moeda
   .deleteOne({moeda:nome});
 }
 