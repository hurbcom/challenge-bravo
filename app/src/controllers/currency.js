module.exports = app => {
    const { currency } = app.src.models;

    const controller = {
        _calculate: (amount, conversion) => {
            return `${(amount * conversion).toFixed(2)}`;
        },

        convert: async (request, response) => {
            const { from, to, amount } = request.query;

            // Obtenção do cambio atual
            const conversion = await currency.convert(from, to);

            // Verifica se a conversão falhou, para então informar ao usuário que ocorreu um erro
            if (!conversion)
                return response
                    .status(500)
                    .json({ message: "Ops! Occurred a error. :(" });

            // Retorna os parametros enviados mais o calculo do cambio (valor * valor cambio)
            return response.status(200).json({
                from,
                to,
                amount,
                conversion: controller._calculate(amount, conversion)
            });
        }
    };

    return controller;
};
