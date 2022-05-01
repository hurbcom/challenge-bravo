const { Router } = require('express');
const exchangesController = require('../controllers/exchanges.controllers');

const router = Router();

router.get('/', exchangesController.convert);

module.exports = router;
