const { MongoClient } = require("mongodb");
const Configuration = require("../config/config");

module.exports = class MongoDBConnection
{
	constructor()
	{
		this._MongoClient = new MongoClient(Configuration.MONGODB_DEFAULT_URL, { useUnifiedTopology: true });
		this._MongoClient.connect();
		this.db = this._MongoClient.db(Configuration.DB_NAME);
	}


}