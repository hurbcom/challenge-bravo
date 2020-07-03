var seeder = require('mongoose-seed');

const db = "mongodb://localhost:27017/currency";

seeder.connect(db, () => {
    seeder.loadModels(["src/models/currencies.js"]);

    seeder.clearModels(['Currencies'], () => {
        seeder.populateModels(data, (error, done) => {
            if (error) {
                return console.log("Seed Error", error)
            }
            if (done) {
                return console.log("Seed Done", done)
            }
            seeder.disconnect();
        })
    });

})

const data = [
    {
        'model': 'Currencies',
        'documents': [
            {
                "code": "USD",
                "name": "Dolar Americano"
            },
            {
                "code": "BRL",
                "name": "Real Brasileiro"
            },
            {
                "code": "EUR",
                "name": "Euro"
            },
            {
                "code": "BTC",
                "name": "Bitcoin"
            },
            {
                "code": "ETH",
                "name": "Ethereum"
            }
        ]
    }
]