module.exports = function valueFormatter(amount) {
    if (isNaN(Number(amount))) {
        amount = amount.split(",").join(".");
        if (!isNaN(Number(amount))) return amount;
    } else {
        return amount;
    }
};
