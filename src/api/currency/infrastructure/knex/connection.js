const conn = require('knexfile')
const knex = require('knex')

module.exports = ({ config }) => knex(conn[config.env])