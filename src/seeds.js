require('dotenv').config();
const seeder = require('mongoose-seed');

//Conecta ao banco - arquivo não achava o .env diretamente
const db =
	`mongodb+srv://UserDB:userdb123@cluster0.cydf3.mongodb.net/test?retryWrites=true`;

//carrega o model e limpa 
seeder.connect(db, () => {
    seeder.loadModels([
        './src/model/CoinModel.js'
    ]);

seeder.clearModels(['Coin'], () => {
    seeder.populateModels(base, () => {
      seeder.disconnect();
    });
  });
}); 

//Base para insert no model - mongodb

const base = [
    {
        'model': 'Coin',
        'documents': [
            {
                'to': 'BRL',
                'label': 'Real Brasileiro'
            },
            {
                'to': 'USD',
                'label': 'Dolar Americano'
            },
            {
                'to': 'EUR',
                'label': 'Euro'
            },
            {
                'to': 'BTC',
                'label': 'Bitcoin'
            },
            {
                'to': 'ETH',
                'label': 'Ethereum'
            }
        ]
    }
];