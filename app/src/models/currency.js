const request = require("request");

module.exports = app => {
    const { currency: cache } = app.src.cache;

    const model = {
        _requestAPI: async (from, to) => {
            // Buscando a conversão na API
            return new Promise((resolve, reject) => {
                const URL = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;

                request(URL, {}, (error, response, body) => {
                    if (error) reject(null);

                    try {
                        // Faz o parse do corpo da requisição, para transformar em objeto para melhor tratamento
                        const parseResult = JSON.parse(body);
                        const result = parseResult[to];

                        if (result) {
                            // Salva o cambio no cache para consultas posteriores
                            cache.save(`${from}-${to}`, result);
                            // Retorna o valor do cambio atual
                            resolve(result);
                        } else {
                            reject(null);
                        }
                    } catch (error) {
                        reject(null);
                    }
                });
            });
        },
        convert: async (from, to) => {
            // Verifica se já existe em cache e retorna o valor caso sim
            const cacheHitVerification = await cache.get(`${from}-${to}`);

            if (cacheHitVerification) return cacheHitVerification;

            return await model._requestAPI(from, to);
        }
    };

    return model;
};
