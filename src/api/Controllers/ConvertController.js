const ConvertService = require('../Services/ConvertService');

module.exports = {

async convert(req, res, next) {
    
    try {
        const response = await ConvertService.convert(req.query);
        return res.status(200).json(response);
    } catch (msg) {
        return res.status(404).json(msg);
    }
}

}