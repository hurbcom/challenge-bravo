const request = require('request');

module.exports = app => {

    const { currency: cache } = app.src.cache;

    const model = {
        convert: async (from, to) => {
            // Verifica se já existe em cache e retorna o valor caso sim
            const cacheVerification = await cache.get(`${from}-${to}`);
            if (cacheVerification)
                return cacheVerification;

            // Se não, busca o a conversão na API
            return new Promise((resolve, reject) => {
                const URL = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
                request(URL, {}, (error, response, body) => {
                    if (error) reject(null);

                    try {
                        // Faz o parse do corpo da requisição, para transformar em objeto para melhor tratamento
                        const result = JSON.parse(body);
                        // Salva o cambio no cache para consultas posteriores
                        cache.save(`${from}-${to}`, result[to]);
                        // Retorna o valor do cambio atual
                        resolve(result[to]);
                    } catch (error) {
                        reject(null);
                    }

                });
            });
        }
    };

    return model;
}