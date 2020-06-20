import _ from 'lodash';
import util from 'util';

import { connections } from '../config.js';
import getDbClient from './mysqlDbClient.js';

const dbClient = getDbClient(connections.currenciesDb);

const currencyRepository = {
	async getCurrencyByIdAsync(id) {
		if (!id || !util.isNumber) throw new Error('Invalid parameters.');

		const query = `SELECT id, description, isoCode 
			FROM currencies.currencies c 
			WHERE c.id = :id;`;

		const result = await dbClient.queryAsync(query, { id });
		return result[0];
	},
	async getCurrencyByIsoCodeAsync(isoCode) {
		if (!isoCode) throw new Error('Invalid parameters.');

		const query = `SELECT id, description, isoCode 
			FROM currencies.currencies c 
			WHERE c.isoCode = :isoCode;`;

		const result = await dbClient.queryAsync(query, { isoCode });
		return result[0];
	},
	async getAllCurrenciesAsync() {
		const query = `SELECT id, description, isoCode 
			FROM currencies.currencies c`;

		const result = await dbClient.queryAsync(query);
		return result;
	},
	async createCurrencyAsync({ description, isoCode }) {
		if (!description || !isoCode) throw new Error('Invalid parameters.');

		const query = `INSERT INTO currencies.currencies (description , isoCode)
			VALUES (:description , :isoCode);`;

		const result = await dbClient.queryAsync(query, { description, isoCode });
		return result.insertId;
	},
	async updateCurrencyAsync({ id, description, isoCode }) {
		if (!id || !util.isNumber || !description || !isoCode) throw new Error('Invalid parameters.');

		const query = `UPDATE currencies.currencies 
			SET description = :description, isoCode = :isoCode
			WHERE id = :id`;

		const result = await dbClient.queryAsync(query, { id, description, isoCode });

		if (result && result.affectedRows == 0) {
			throw new Error('Error updating currency');
		}
	},
	async deleteCurrencyByIdAsync(id) {
		if (!id || !util.isNumber) throw new Error('Invalid parameters.');

		const query = `DELETE FROM currencies.currencies WHERE id = :id`;
		
		const result = await dbClient.queryAsync(query, { id });

		if (result && result.affectedRows == 0) {
			throw new Error('Error updating currency');
		}
	}
};

export default currencyRepository;
