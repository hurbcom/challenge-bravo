db.currencies.drop();
db.currencies.createIndex({ currency: 1 }, { unique: true });
db.currencies.insertMany([
    {
        currency: 'USD',
    },
    {
        currency: 'BRL',
    },
    {
        currency: 'EUR',
    },
]);