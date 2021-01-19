// const dotenv = require('dotenv');
const seeder = require('mongoose-seed');
const databaseConfig = require('./config/database');

seeder.connect(databaseConfig.uri, () => {
    seeder.loadModels([
        'src/models/Currency.js'
    ]);

seeder.clearModels(['Currency'], () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});

const data = [
    {
        'model': 'Currency',
        'documents': [
            {
                'symbol': 'USD',
                'label': 'United States dollar'
            },
            {
                'symbol': 'BRL',
                'label': 'Brazilian Real'
            },
            {
                'symbol': 'EUR',
                'label': 'European Euro'
            },
            {
                'symbol': 'BTC',
                'label': 'Bitcoin'
            },
            {
                'symbol': 'ETH',
                'label': 'Ethereum'
            }
        ]
    }
];