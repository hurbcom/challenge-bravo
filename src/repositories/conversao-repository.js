const mongoose = require('mongoose');
const moeda = mongoose.model('Moeda');


exports.get = async(from, to) => {
    
 

    const cotacaofrom = moeda.findOne({moeda: from});

   moeda.find({ moeda: from }).
      then(cotacaofrom => {              
    console.log(cotacaofrom[0].cotacaodolar); // 'A'
   
  });

  console.log(a);

    //const cotacaoto =  moeda.findOne({moeda: to});
    
    
    c//onsole.log(cotacaofrom[1].moeda);


   
    return cotacaofrom;
    //const res = moeda.find({});
    //console.log(res);
    //return res;
 }