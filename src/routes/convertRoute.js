const express = require('express');
const router = express.Router();
const controller = require('../controllers/convertController');
router.get('/', controller.get);
router.get('/:from/:to/:amount', controller.getfriendly);
module.exports = router;