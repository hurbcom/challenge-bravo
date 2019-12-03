const coinsService = require("../services/coinService");

//Exportando o método POST da rota para o router
exports.insertCoin = (req, res) => {
    let coin = req.body.coin;
    coinsService.setCoin(coin, res);
};

//Exportando o método DELETE da rota para o router
exports.deleteCoin = (req, res) => {
    let id = req.query.id;
    coinsService.deleteCoin(id, res);
};

//Exportando o método GET da rota para o router
exports.getCoins = (req, res) => {
    coinsService.getCoins(res);
};
