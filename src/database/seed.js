var seeder = require('mongoose-seed');
require('dotenv').config();

const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_DB,
	MONGO_CLUSTER
} = process.env;

const dbURI =
	`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.f7bim.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

// Conecta ao banco de dados via Mongoose
seeder.connect(dbURI, function () {

    // Carrega o modelo do Mongoose
    seeder.loadModels([
        'src/models/currencyModel',
    ]);

    // Limpa a coleção
    seeder.clearModels(['Currency'], () => {

        // Callback para popular o BD assim que a coleção for limpa
        seeder.populateModels(data, (error) => {
            if (error) {
                return console.log("Error seeding!", error)
            }
            seeder.disconnect();
        });

    });
});

// Array de dados que serão inseridos no modelo
var data = [
    {
        'model': 'Currency',
        'documents': [
            {
                "sigla": "BRL",
                "nome": "Real Brasileiro"
            },
            {
                "sigla": "EUR",
                "nome": "Euro"
            },
            {
                "sigla": "USD",
                "nome": "Dolar Americano"
            },
            {
                "sigla": "BTC",
                "nome": "Bitcoin"
            },
            {
                "sigla": "ETH",
                "nome": "Ethereum"
            }
        ]
    }
];
