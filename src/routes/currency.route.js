const express = require('express');
const router = express.Router();
const controller = require('../controllers/currency.controller.js')

router.get('/', controller.get);
router.get('/:code', controller.getByCode);
router.post('/', controller.post);
router.delete('/:code', controller.delete);

module.exports = router;