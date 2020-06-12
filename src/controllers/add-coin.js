const baseCoins = require("@utils/coin-base.json");
const updateJson = require("@utils/update-json.js");
const valueFormatter = require("@utils/value-formatter");

module.exports = async (req, res) => {
    const coin = req.body;
    let name = coin.name.toUpperCase();
    let value = valueFormatter(coin.value);
    var coins = JSON.stringify(baseCoins);
    coins = `{${coins.substr(
        1,
        coins.length - 2
    )},"${name}": {"value": "${value}", "lastUpdate":"${new Date().toLocaleString()}"} }`;

    const result = await updateJson(coins);
    if (result == "Success") {
        var message = `${name} currency with a value of ${value} based on USD of was successfully registered`;
    }
    res.json({ message });
};
