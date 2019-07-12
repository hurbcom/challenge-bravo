module.exports = () => {
    // Array de moedas válidas
    const VALID_CURRENCY = ["USD", "BRL", "EUR", "BTC", "ETH"];

    const validators = {
        convert_parameters: request => {
            let { from, to, amount } = request.query;

            if (!from || !to || !amount)
                throw Error(
                    "Ops! Incomplete parameters (from, to or amount). :("
                );

            // Põe as siglas em maiusculo para normalização
            from = from.toUpperCase();
            to = to.toUpperCase();

            // Verifica se o valor de 'from' existe no array de moedas válidas
            if (!VALID_CURRENCY.includes(from))
                throw Error(`Ops! ${from} is not a valid currency. :(`);

            // Verifica se o valor de 'to' existe no array de moedas válidas
            if (!VALID_CURRENCY.includes(to))
                throw Error(`Ops! ${to} is not a valid currency. :(`);

            // Verifica se o valor de 'amount' está formatado corretamente (100, 100.00, 1000.00, 10000.00...)
            if (!/^[0-9]+(\.[0-9]{1,2})?$/gm.test(amount))
                throw Error(
                    `Ops! ${amount} is not a valid value (eg.: 100 or 100.00 or 1000.00). :(`
                );

            // Insere os dados transformados (upperCase) no objeto de requisição para repassar ao controller
            request.query.from = from;
            request.query.to = to;

            return request;
        }
    };

    return validators;
};
