const config = require('../config/config');

const validateHelper = ({ from, to, amount }) => config.ACCEPT_COIN.includes(from) && config.ACCEPT_COIN.includes(to) && !!amount;

module.exports = validateHelper;
