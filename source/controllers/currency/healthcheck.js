'use strict'

const healthCheck = (req, res) => {
    res.status(200).json({"message": "OK"})
}

module.exports = healthCheck;