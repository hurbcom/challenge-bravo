const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestao-moeda-controllers');


router.post('/', controller.post);

router.get('/', controller.get)

router.delete('/', controller.delete);

module.exports = router;