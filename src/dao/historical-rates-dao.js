const MongoDB = require("mongodb");
const Configuration = require("../config/config");


const HISTORICAL_RATES_COLLECTION_NAME = "historical-exchange-rates";
class HistoricalRatesDao {
	constructor() {
		this.MongoClient = new MongoDB.MongoClient(Configuration.MONGODB_DEFAULT_URL, { useUnifiedTopology: true });
		this.MongoClient.connect();
	}

	async insert(historicRate) {
		await this.MongoClient.db(Configuration.DB_NAME).collection(HISTORICAL_RATES_COLLECTION_NAME).insertOne(historicRate);
	}
	async getLatest() {
		let sorting = {"referenceDate":-1};
		let values = await this.MongoClient.db(Configuration.DB_NAME).collection(HISTORICAL_RATES_COLLECTION_NAME).find().sort(sorting).limit(1).toArray();
		return values[0];
	}

}

module.exports = HistoricalRatesDao;

