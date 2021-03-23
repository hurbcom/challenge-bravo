const repository = require('../repositories/moeda-repository');
const md5 = require('md5');

exports.put = async(req,res,next)=>{
    try {

        await repository.put(req.params.id, req.body);
        console.log();
        res.status(200).send({
            "metodo": "insereMoeda",
            "resultado": "SUCESSO",
            "payload": 
            {   
                id: req.params.id,
                moeda:req.body.moeda,
                cotacao:req.body.cotacao,
            } 
        });

  } catch (e) {
     
    res.status(500).send({
        "metodo": "insereMoeda",
        "resultado": "FALHA",
        "payload": 
        {   
            id: req.params.id,
            moeda:req.body.moeda,
            cotacao:req.body.cotacao,
        } 
    });

  }
};