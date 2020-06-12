const updateJson = require("@utils/update-json.js");
const baseCoins = require("@utils/coin-base.json");
const valueFormatter = require("@utils/value-formatter");

module.exports = async (req, res) => {
    const coin = req.body;
    let name = coin.name.toUpperCase();
    let value = valueFormatter(coin.value);
    var message;
    if (Object.keys(baseCoins).includes(name) && value) {
        baseCoins[name].value = value;
        baseCoins[name].lastUpdate = new Date().toLocaleString();

        var coins = JSON.stringify(baseCoins);
        const result = await updateJson(coins);
        if (result == "Success") {
            message = `${name} currency value has been successfully updated to $${value}`;
        }
    } else if (!value) {
        message = `Error: Value is NaN`;
    } else message = `Coin not found in the coin database`;
    res.json({ message });
};
