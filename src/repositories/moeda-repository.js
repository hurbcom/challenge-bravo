const mongoose = require('mongoose');
const lead = mongoose.model('Moeda');

exports.put = async(id, data) => {
    await lead
    .findByIdAndUpdate(id,{
        $set: 
        {
            moeda:data.moeda,
            cotacao:data.cotacao,
        }

    });
 }

 exports.delete = async(id) => {
    return lead
    .findByIdAndDelete(id);
 }
 