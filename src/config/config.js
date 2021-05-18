const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required().description('The DB_HOST environment variable is required'),
    DB_USER: Joi.string().required().description('The DB_USER environment variable is required'),
    DB_PASS: Joi.string().required().description('The DB_PASS environment variable is required'),
    DB_NAME: Joi.string().required().description('The DB_NAME environment variable is required'),
    DB_DIALECT: Joi.string().required().description('The DB_DIALECT environment variable is required'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  server_port: envVars.PORT,
  host: envVars.DB_HOST,
  username: envVars.DB_USER,
  password: envVars.DB_PASS,
  database: envVars.DB_NAME,
  redis_host: envVars.REDIS_HOST,
  redis_port: envVars.REDIS_PORT,
  api_currency_convert: envVars.API_CURENCY_CONVERT,
  currency_rate_name: envVars.CURRENCY_RATE_NAME,
  dialect: envVars.NODE_ENV === 'test' ? envVars.DB_DIALECT_TEST : envVars.DB_DIALECT,
  logging: false,
  define: {
    timestamps: true,
  },
};
