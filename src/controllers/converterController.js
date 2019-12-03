const converterService = require("../services/converterService");

//Exportando o método GET da rota para o router
exports.getValue = (req, res) => {
    let from = req.query.from;
    let to = req.query.to;
    let amount = req.query.amount;

    converterService.getValue(from, to, amount, res);
};
