const ConvertService = require('../Services/ConvertService');

module.exports = {

async convert(req, res, next) {

    // validators.client(req); // TODO joy

    try {
        const response = await ConvertService.convert(req.param);
        return res.status(200).json(response);
    } catch (e) {
        return next(e);
    }
}

}