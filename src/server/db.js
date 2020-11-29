const mongoose = require("mongoose");
require('dotenv').config();
/*
const dbURI =
	"mongodb+srv://hurb:D4t4b4s3@cluster-hurb.f7bim.mongodb.net/CurrencyConverter?retryWrites=true&w=majority";
*/
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
	.then(() => {
		console.log("Banco de dados conectado!");
	})
	.catch(err => {
		console.log("Não foi possível se conectar ao banco de dados!", err);
		process.exit();
	});


// Models
require("../models/currencyModel");