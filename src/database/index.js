import Sequelize from 'sequelize';
import path from 'path';
import Umzug from 'umzug';
import databaseConfig from '../config/database';

import Currency from '../app/models/CurrencyModel';

const models = [Currency];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        this.migrate(this.connection);

        models.map(model => model.init(this.connection));
        models.map(model => model.associate && model.associate(this.connection.models));
    }

    /**
     * Apply all pending migrations.
     *
     * @param {Sequelize} sequelize the sequelize instance
     * @returns a promise that resolves after migrations are completed
     */
    migrate(sequelize) {
        const umzug = new Umzug({
            storage: 'sequelize',

            storageOptions: {
                sequelize
            },

            migrations: {
                params: [sequelize.getQueryInterface(), Sequelize],
                path: path.join(__dirname, './migrations')
            }
        });

        return umzug.up();
    }
}

export default new Database();
