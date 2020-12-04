var express = require('express');
var router = express.Router();

// we will use 3 routes (endpoint) for this api
router.get('/ChangeCurrency', (req, res) => {
    return res.json({message: "Change Currency Routes"})
});

router.get('/AddCurrency', (req, res) => {
    return res.json({message: "Change Currency Routes"})
});

router.get('/RemoveCurrency', (req, res) => {
    return res.json({message: "Change Currency Routes"})
});

module.exports = router