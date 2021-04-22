const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        // Obtendo token do header
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecret);
        // Verificando se o token é valido
        if (!decodedToken.id) {
            throw 'Token Inválido!';
        }

        // Token válido, continuar para a função no controller
        next();
    } catch {
        // Token inválido
        res.status(401).json({status: 401, message: 'Token Inválido!'});
    }
};