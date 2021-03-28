const repository = require('../repositories/gestao-moeda-repository');

exports.delete = async(req,res,next)=>{
    try {
       await repository.delete(req.query.moeda);
       res.status(200).send({
            "metodo": "deletaMoeda",
            "resultado": "SUCESSO",
            "payload":req.query.moeda
        });
   
    
  } catch (e) {
     
    res.status(500).send({
        "metodo": "deletaMoeda",
        "resultado": "FALHA",
        "payload": req.query.moeda
        
    });

  }
};

exports.get = async(req,res,next)=>{
    try {
        const data = await repository.get();
        res.status(200).send({
            "metodo": "listaMoedas",
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

exports.post = async(req,res,next) => {
    try {
        await repository.post(
            {   
                moeda:req.body.moeda,
                cotacaodolar:req.body.cotacaodolar
            });
        res.status(201).send({
            "metodo": "salvaMoeda",
            "resultado": "SUCESSO",
            "payload":{
                id: req.params.id,
                moeda:req.body.moeda,
                cotacaodolar:req.body.cotacaodolar,
            }

        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            "metodo": "salvaMoeda",
            "resultado": "FALHA",
            "payload":{
                id: req.params.id,
                moeda:req.body.moeda,
                cotacaodolar:req.body.cotacaodolar,
            }

        });
    }    
};

