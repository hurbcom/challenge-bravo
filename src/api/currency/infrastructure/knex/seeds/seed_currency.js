
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('currencies').del()
        .then(function () {
            // Inserts seed entries
            return knex('currencies').insert([
                { id: 1, abbreviation: 'BRL' },
                { id: 2, abbreviation: 'USD' },
                { id: 3, abbreviation: 'ETH' },
                { id: 4, abbreviation: 'BTC' },
                { id: 5, abbreviation: 'EUR' },
            ]);
        });
};
