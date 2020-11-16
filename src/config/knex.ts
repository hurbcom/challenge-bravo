import knex from 'knex';
import knexfile from '../knexfile';

const env = process.env.ENVIRONMENT || 'development';

const configOptions = knexfile[env];

export default knex(configOptions);
