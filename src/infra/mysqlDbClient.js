import Promise from 'bluebird';
import mysql  from 'mysql';

import Connection from 'mysql/lib/Connection.js';
import Pool from 'mysql/lib/Pool.js';
Promise.promisifyAll(Connection.prototype);
Promise.promisifyAll(Pool.prototype);

var initialMysqlConfig = {
	queryFormat(query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, (txt, key) => {
			if (values.hasOwnProperty(key)) {
				let value = values[key];
				if (value && value instanceof Function) {
					throw new Error(
						'Error parsing value. Cannot be a function. Key:' + key + '\nQuery:' + query
					);
				}
				return this.escape(value);
			}
			return 'NULL';
		});
	}
};

class MySqlDbClient {
	constructor(config) {
		this.mysqlConfig = Object.assign({}, initialMysqlConfig, config);
		this.connectionPool = mysql.createPool(this.mysqlConfig);
	}

	queryAsync(query, params) {
		return this.connectionPool.queryAsync(query, params);
	}

	heartbeatAsync() {
		const query = `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED ;
             SELECT 1 as id;
			 COMMIT;`;
		return this.queryAsync(query);
	}
}

const clients = {};

function getClient(config) {
	const alias = config.host + (config.database || '');
	const instance = clients[alias];
	if (!instance) {
		clients[alias] = new MySqlDbClient(config);
	}

	return clients[alias];
}

export default getClient;
