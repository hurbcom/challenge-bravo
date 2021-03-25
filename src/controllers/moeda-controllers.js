const repository = require('../repositories/moeda-repository');


exports.put = async(req,res,next)=>{
    try {
      
        await repository.put(req.params.id, req.body);
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

exports.delete = async(req,res,next)=>{
    try {
       await respository.delete(req.body.id);
       res.status(200).send({
            "metodo": "deletaMoeda",
            "resultado": "SUCESSO",
            "payload": 
            {
                id: req.body.id
            } 
        });
   
    
  } catch (e) {
     
    res.status(500).send({
        "metodo": "deletaMoeda",
        "resultado": "FALHA",
        "payload": 
        {
            id: req.body.id
        } 
        
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

exports.get = async(req,res,next)=>{
    try {
        const data = await repository.get();
        console.log(data);
        res.status(200).send({
            "metodo": "listaLeads",
            "resultado": "SUCESSO",
            "payload": data 
        });

  } catch (e) {
     
    res.status(500).send({
        "metodo": "listaLeads",
        "resultado": "FALHA",
        "payload": data 
    });

  }
};
