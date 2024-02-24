
const format2float = (amount, crypto = false) => {
    amount = amount.toString();
    const commaIndex = amount.indexOf(',');
    const dotIndex = amount.indexOf('.');

    if(commaIndex < dotIndex) amount = amount.replace(/\,/g, '');
    else amount = amount.replace(/\./g, '').replace(',', '.');
    
    if(!crypto) amount = parseFloat(parseFloat(amount).toFixed(2));
    else amount = parseFloat(amount);
    
    return amount;
};

const formatCurrency = (amount, currency = 'USD', crypto = false) => {
    amount = format2float(amount, crypto);

    let minimumFractionDigits = 2;
    if(crypto) minimumFractionDigits = 10;

    try {
        return amount.toLocaleString('pt-BR', { style: 'currency', currency: currency, minimumFractionDigits });
    } catch (error) {
        return "$ " + amount;
    }
};

module.exports = {
    format2float,
    formatCurrency
};
