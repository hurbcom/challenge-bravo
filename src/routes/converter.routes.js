const { Router } = require('express');
const { converter } = require('../middleware/validator.middleware');
const { convert } = require('../controllers/converter.controller');

const router = Router();

router.get('/', converter, convert);

module.exports = router;