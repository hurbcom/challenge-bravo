import { Pool } from 'pg';
import DBConfig from '../config/database';

class Database {
    constructor () {
        this._resetConnectionRetries();
        this._connect();
    }

    _resetConnectionRetries () {
        this.connectionRetry = 5
    }

    _connect () {
        try {
            this.pool = new Pool(DBConfig);

            this._resetConnectionRetries();
        } catch (err) {
            this.connectionRetry -= 1;

            if (this.connectionRetry) this._connect();
            else throw err;
        }
    }

    async query(qText, qValues) {
        try {
            const { rows } = await this.pool.query(qText, qValues);

            return rows;
        } catch (err) {
            throw err;
        }
    }
}

export default new Database();