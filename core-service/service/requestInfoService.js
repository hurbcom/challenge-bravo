
//Serviço para pegar os parametros da url da requisição.
module.exports = function requestInfoService(req){
    return {
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount
    }
}
