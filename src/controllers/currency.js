const getAll = async () => {
    return true;
};

const getByCode = async code => {
    return code;
};

const conversion = async (from, to, amount) => {
    return { from, to, amount };
};

const newCurrency = async (code, bid) => {
    return { code, bid };
};

const removeCurrency = async code => {
    return code;
}

module.exports = {
    getAll,
    getByCode,
    conversion,
    newCurrency,
    removeCurrency
}