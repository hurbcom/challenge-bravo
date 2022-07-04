const db = require("../config/config");

const Currency = {};

// CREATE AN NEW CURRENCY
Currency.create = (name, code, exchange_rate) => {
    return db.none(
        `INSERT into currencies(name,code,exchange_rate)` +
            `VALUES($1, $2, $3)`,
        [name, code.toUpperCase(), exchange_rate]
    );
};

// GET ALL CURRENCIES TO TEST
Currency.get = () => {
    return db.any("SELECT * FROM currencies");
};

// DELETE A CURRENCY
Currency.delete = (id) => {
    return db.none(`DELETE from currencies WHERE id = $1`, id);
};

module.exports = Currency;
