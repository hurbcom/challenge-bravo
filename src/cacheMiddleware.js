const redis = require('redis');
const REDIS_URL = process.env.REDIS_URL || null;
const client = redis.createClient(REDIS_URL);
const { validationResult } = require('express-validator');

module.exports = {
    middleware: (req, res, next) => {
        if (!validationResult(req).isEmpty())
            next();

        const { from, to, amount } = req.query;
        const key = `__bravo__${from}_${to}_${amount}`;
        client.get(key, (err, reply) => {
            if (err)
                return res.status(500)
                          .json({
                              errors: [
                                  'Something went wrong in caching.'
                              ]
                          })

            if (reply) {
                return res.contentType('application/vnd.api+json')
                   .status(200)
                   .send(reply);
            }
            else
                res.sendResponse = res.send;

            res.send = (body) => {
                client.set(key, body);
                res.sendResponse(body);
            }
            next();
        })
    },
    removeEntries: (coinID) =>
        client.keys("*", function (err, keys) {
            keys.forEach(function (key, pos) {
                if (key.includes(coinID))
                    client.del(key);
            });
        })
}
