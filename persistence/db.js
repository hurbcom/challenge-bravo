const db = require('text-db')('./store');
const fs = require('fs');

if (fs.existsSync('./store/storage.json')) {
	db.clear();
}

db.setItem('BRL', {dolar:4.20,me:0.24});
db.setItem('EUR', {dolar:0.91,me:1.10});
db.setItem('BTC', {dolar:0.00014,me:7261.09});
db.setItem('ETH', {dolar:0.0066,me:151.29});


