const repository = require('../repositories/conversao-repository');

exports.get = async(req,res,next)=>{
    try {
      const from = req.query.from;
      const to = req.query.to;
      const amount = req.query.amount;

      const data = await repository.get(from, to, amount);
         res.status(200).send({
            "metodo": "converteMoedas",
            "resultado": "SUCESSO",
            "payload": data 
       });

  } catch (e) {
     
    res.status(500).send({
        "metodo": "listaMoedas",
        "resultado": "FALHA",
        "payload": data 
    });

  }
};
