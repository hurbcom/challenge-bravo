const baseCoins = require("@utils/coin-base.json");

module.exports = (req, res) => {
    res.json(baseCoins);
};
