const Configuration = require('../../config/config');

module.exports = (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', Configuration.CORS_ALLOW_ORIGIN);
    next();
};
