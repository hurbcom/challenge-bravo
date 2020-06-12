module.exports = function valueFormatter(amount) {
    if (isNaN(Number(amount))) {
        amount = amount.split(",").join("."); // se não tiver "," e tentar dar join retorna undefined e pula para else
        if (!isNaN(Number(amount))) return amount;
    } else {
        return amount;
    }
};
