import { connections } from '../config.js';
import mySqlClient from '../infra/mysqlDbClient.js';

const currenciesDbClient = mySqlClient(connections.currenciesDb);

const controller = {
	set(server) {
		server.get('/isAlive', this.isAlive);
		server.head('/isAlive', this.isAlive);
	},
	async isAlive(request, response, next) {
		try {
			await currenciesDbClient.heartbeatAsync();

			response.send(200);
			return next();
		} catch (error) {
			console.error(error);
			response.send(500);
		}
	}
};

export default controller;
