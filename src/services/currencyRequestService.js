exports.validateConvertCurrencyFields = (data, availableCurrencies) => {
    let errors = [];

    // Validando o campo from
    if (!data.from) {
        errors.push("O campo 'from' é obrigatório!");
    } else if (availableCurrencies.indexOf(data.from) === -1) {
        errors.push(`A moeda '${data.from}' não é permitida!`);
    }

    // Validando o campo to
    if (!data.to) {
        errors.push("O campo 'to' é obrigatório!");
    } else if (availableCurrencies.indexOf(data.to) === -1) {
        errors.push(`A moeda '${data.to}' não é permitida!`);
    }

    // Validando o campo amount
    if (!data.amount) {
        errors.push("O campo 'amount' é obrigatório!");
    } else if (isNaN(data.amount)) {
        errors.push("O campo 'amount' deve ser um valor numérico (use . para separar os centavos)");
    }

    return errors;
};

exports.validateAddCurrencyFields = (data) => {

};