
const Configuration = require("../config/config");
const MongoDBConnection = require("./mongo-db-connection");


const HISTORICAL_RATES_COLLECTION_NAME = "historical-exchange-rates";
class HistoricalRatesDao {
	constructor(container) {
		this.db = container.get(MongoDBConnection).db;
	}

	async insert(historicRate) {
		await this.db.collection(HISTORICAL_RATES_COLLECTION_NAME).insertOne(historicRate);
	}
	async getLatest() {
		let sorting = {"referenceDate":-1};
		let values = await this.db.collection(HISTORICAL_RATES_COLLECTION_NAME).find().sort(sorting).limit(1).toArray();
		return values[0];
	}

}

module.exports = HistoricalRatesDao;

