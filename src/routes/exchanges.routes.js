const { Router } = require('express');
const exchangesController = require('../controllers/exchanges.controllers');
const exchangesMiddleware = require('../middlewares/exchanges.middlewares');

const router = Router();

router.get('/', exchangesMiddleware.validateQuery, exchangesController.convert);

module.exports = router;
