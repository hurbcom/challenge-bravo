const repository = require('../repositories/conversao-repository');

exports.get = async(req,res,next)=>{
    try {
      var amountConverted = 0; 

      const from = req.query.from;
      const to = req.query.to;
      const amount = req.query.amount;

      const cotacaoTo =  await repository.get(to);

      const cotacaoFrom = await repository.get(from);


      if(from =='USD' && cotacaoTo != null)
      {
      
        amountConverted = amount * cotacaoTo[0]['cotacaodolar'];

      }else if(to =='USD' && cotacaoFrom !=null) 
      {      
        amountConverted = (amount/cotacaoFrom[0]['cotacaodolar']);

      }else if(from != 'USD' && to != 'USD' && cotacaoFrom != null && cotacaoTo != null)
      {
        
        amountConverted = (amount/cotacaoFrom[0]['cotacaodolar'])*cotacaoTo[0]['cotacaodolar'];

      }

         res.status(200).send({
            "metodo": "converteMoedas",
            "resultado": "SUCESSO",
            "payload": {"valor convertido": amountConverted}
        });

  } catch (e) {
     
    res.status(500).send({
        "metodo": "listaMoedas",
        "resultado": "FALHA",
        "payload": {"valor convertido": amountConverted}
    });

  }
};
