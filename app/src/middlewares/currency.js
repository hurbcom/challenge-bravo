module.exports = app => {

    // Array de moedas válidas
    const VALID_CURRENCY = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

    const middleware = {
        validate: async (request, response, next) => {
            let { from, to, amount } = request.query;

            // Verifica se existem os parametros e os informa de maneira correta, caso não.
            if (!from || !to || !amount)
                return response.status(400).json({ message: `Ops! Incomplete parameters (from, to or amount). :(` });

            // Põe as siglas em maiusculo para normalização
            from = from.toUpperCase();
            to = to.toUpperCase();

            // Verifica se o valor de 'from' existe no array de moedas válidas
            if (!VALID_CURRENCY.includes(from))
                return response.status(400).json({ message: `Ops! ${from} is not a valid currency. :(` });

            // Verifica se o valor de 'to' existe no array de moedas válidas
            if (!VALID_CURRENCY.includes(to))
                return response.status(400).json({ message: `Ops! ${to} is not a valid currency. :(` });

            // Verifica se o valor de 'amount' está formatado corretamente (100, 100.00, 1000.00, 10000.00...)
            if (!(/^[0-9]+(\.[0-9]{1,2})?$/gm.test(amount)))
                return response.status(400).json({ message: `Ops! ${amount} is not a valid value. :(`, format: '100 or 100.00 or 1000.00' });

            // Insere os dados transformados (upperCase) no objeto de requisição para repassar ao controller
            request.query.from = from;
            request.query.to = to;

            next();
        }
    };

    return middleware;
}