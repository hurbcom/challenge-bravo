import _ from 'lodash';
import util from 'util';

import { connections } from '../config.js';
import getDbClient from './mysqlDbClient.js';

const dbClient = getDbClient(connections.currenciesDb);

const currencyRepository = {
	async getCurrencyByIdAsync(id) {
		if (!id || !util.isNumber) throw new Error('Invalid parameters.');

		const query = `SELECT id, description, symbol 
			FROM currencies.currencies c 
			WHERE c.id = :id;`;

		const result = await dbClient.queryAsync(query, { id });
		return result[0];
	},
	async getCurrencyBySymbolAsync(symbol) {
		if (!symbol) throw new Error('Invalid parameters.');

		const query = `SELECT id, description, symbol 
			FROM currencies.currencies c 
			WHERE c.symbol = :symbol;`;

		const result = await dbClient.queryAsync(query, { symbol });
		return result[0];
	},
	async getAllCurrenciesAsync() {
		const query = `SELECT id, description, symbol 
			FROM currencies.currencies c`;

		const result = await dbClient.queryAsync(query, { symbol });
		return result;
	},
	async createCurrencyAsync({ description, symbol }) {
		if (!description || !symbol) throw new Error('Invalid parameters.');

		const query = `INSERT INTO currencies.currencies (description , symbol)
			VALUES (:description , :symbol);`;

		const result = await dbClient.queryAsync(query, { description, symbol });
		return result.insertId;
	},
	async updateCurrencyAsync({ id, description, symbol }) {
		if (!id || !util.isNumber || !description || !symbol) throw new Error('Invalid parameters.');

		const query = `UPDATE currencies.currencies 
			SET description = :description, symbol = :symbol
			WHERE id = :id`;

		const result = await dbClient.queryAsync(query, { id, description, symbol });

		if (result && result.affectedRows == 0) {
			throw new Error('Error updating currency');
		}
	},
	async deleteCurrencyByIdAsync(id) {
		if (!id || !util.isNumber) throw new Error('Invalid parameters.');

		const query = `DELETE FROM currencies.currencies 
			WHERE id = :id`;

		var connection = await dbClient.getConnectionAsync();
		var result = await connection.queryAsync(query, { id });

		if (result && result.affectedRows == 0) {
			throw new Error('Error updating currency');
		}
	}
};

export default currencyRepository;
