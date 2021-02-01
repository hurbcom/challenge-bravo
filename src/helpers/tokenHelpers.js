const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = {
    generateToken
};