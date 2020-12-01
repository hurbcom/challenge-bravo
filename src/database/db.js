const mongoose = require("mongoose");
require('dotenv').config();

const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_DB,
	MONGO_CLUSTER
} = process.env;

const dbURI =
	`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.f7bim.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.set('useCreateIndex', true);

mongoose.connect(dbURI, {
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