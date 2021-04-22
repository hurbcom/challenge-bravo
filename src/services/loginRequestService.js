/**
 * Faz a validação dos campos do endpoint de login
 * 
 * @param {object} data 
 * @returns {array}
 */
exports.validateLoginFields = (data) => {
    let errors = [];

    // Validação do username
    if (!data.username) {
        errors.push("O campo 'username' é obrigatório!");
    }

    // Validação do password
    if (!data.password) {
        errors.push("O campo 'password' é obrigatório!");
    }

    return errors;
};

/**
 * Faz a validação dos campos do endpoint de login
 * 
 * @param {string} plainPassword 
 * @returns {string}
 */
exports.getHashedPassword = (plainPassword) => {
    const salt = process.env.HASH_SALT || 'secret';
    const hashedPassword = require('crypto').createHmac('sha256', salt)
        .update(plainPassword).digest('hex');

    return hashedPassword;
};

/**
 * Gera um JWT contendo as informações passadas
 * 
 * @param {object} data 
 * @param {integer} expiresIn 
 * @returns {string}
 */
exports.generateJwt = (data, expiresIn = 18000) => {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = require('jsonwebtoken').sign(data, jwtSecret, {
        expiresIn: expiresIn
    });

    return token;
}