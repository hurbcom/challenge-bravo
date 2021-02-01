const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ "error" : "No token provided." });
    }

    const parts = authHeader.split(' ');
    if(!parts.length === 2) {
        return res.status(401).send({ "error" : "Token was errors." });
    }

    const [ scheme, token ] = parts;
    if(!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ "error" : "Malformatted token." });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ "error" : "Invalid token." });

        req.userId = decoded.id;
        return next();
    });
};

module.exports = {
    authMiddleware
};