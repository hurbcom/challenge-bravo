const updateJson = require("@utils/update-json.js");
const baseCoins = require("@utils/coin-base.json");
const valueFormatter = require("@utils/value-formatter");

module.exports = async (req, res) => {
    const coin = req.body;
    let name = coin.name.toUpperCase();
    let value = valueFormatter(coin.value);

    baseCoins[name].value = value;
    baseCoins[name].lastUpdate = new Date().toLocaleString();

    var coins = JSON.stringify(baseCoins);
    const result = await updateJson(coins);
    if (result == "Success") {
        var message = `${name} currency value has been successfully updated to $${value}`;
    }
    res.json({ message });
};
