exports.seed = async function (knex) {
   await knex('coins').insert([
        { code: 'USD', name: 'ólar Comercial', lastro: 5.156 },
        { code: 'EUR', name: 'Euro', lastro: 5.841},
        { code: 'BTC', name: 'Bitcoin', lastro: 48950},
        { code: 'Eth', name: 'Ethereum', lastro: 672},
        { code: 'BRL', name: 'Real', lastro: 1},
    ])
};