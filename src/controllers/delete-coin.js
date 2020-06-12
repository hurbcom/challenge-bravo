const baseCoins = require("@utils/coin-base.json");
const updateJson = require("@utils/update-json.js");

module.exports = async (req, res) => {
    var { id } = req.params;
    id = id.toUpperCase();
    delete baseCoins[id];
    const coins = JSON.stringify(baseCoins);
    const result = await updateJson(coins);
    if (result == "Success") {
        var message = `${id} successfully removed`;
    }
    res.json({ message });
};
