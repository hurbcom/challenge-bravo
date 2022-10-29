const express = require('express');
const router = express.Router();
const convertController = require('../controllers/convert-controller')

router.post('/', convertController.convert);

module.exports = router;