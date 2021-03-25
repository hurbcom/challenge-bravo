const mongoose = require('mongoose');
const moeda = mongoose.model('Moeda');



exports.get = async(data) => {
    const res = moeda.find({});
    console.log(res);
    return res;
 }

 exports.post = async(data) => {
    const moedacreated = new moeda(data);
    await moedacreated.save();
}


exports.put = async(id, data) => {
    await moeda
    .findByIdAndUpdate(id,{
        $set: 
        {
            moeda:data.moeda,
            cotacao:data.cotacao,
        }

    });
 }

 exports.delete = async(id) => {
    return moeda
    .findByIdAndDelete(id);
 }
 