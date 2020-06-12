const baseCoins = require("@utils/coin-base.json");
const updateJson = require("@utils/update-json.js");
const valueFormatter = require("@utils/value-formatter");

module.exports = async (req, res) => {
    const coin = req.body; //pegar o objeto coin do body

    let name = coin.name.toUpperCase(); //colocar o name em upper case para tornar a requisição não sensitiva

    let value = valueFormatter(coin.value);
    var message;

    if (Object.keys(baseCoins).includes(to) && value) {
        var coins = JSON.stringify(baseCoins);
        coins = `{${coins.substr(
            1,
            coins.length - 2
        )},"${name}": {"value": "${value}", "lastUpdate":"${new Date().toLocaleString()}"} }`;

        const result = await updateJson(coins);
        if (result == "Success") {
            message = `${name} currency with a value of ${value} based on USD of was successfully registered`;
        }
    } else if (!value) {
        message = `Error: Value is NaN`;
    } else message = `Coin not found in the coin database`;
    res.json({ message });
};
