const express = require('express');
const router = express.Router();
const controller = require('../controllers/popular-banco-controller');


router.get('/', controller.get);

/*
const route = router.get('/', (req, res, next)=> {
    res.status(200).send({
        title: "Node API",
        version: "0.0.1"
    });
});
*/

module.exports = router;