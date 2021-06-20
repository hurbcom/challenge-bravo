
class CurrencyController {

    getCurrency(req, res, next){
        res.send(200, { mensagem: "Teste inicial" });
    }
}




module.exports = CurrencyController;