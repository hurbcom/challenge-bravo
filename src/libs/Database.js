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

    async query(qText, qValues, { transaction } = {}) {
        const client = transaction || this.pool;

        try {
            const { rows } = await client.query(qText, qValues);

            return rows;
        } catch (err) {
            throw err;
        }
    }

    async transaction(callback) {
        let client;
        
        try {
            client = await this.pool.connect();

            await client.query('BEGIN');
            await callback(client);
            await client.query('COMMIT');
        } catch (err) {
            client.query('ROLLBACK');

            throw err;
        } finally {
            client.release();
        }
    }
}

export default new Database();