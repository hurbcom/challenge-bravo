const express = require('express');
const router = express.Router();
const controller = require('../controllers/moeda-controllers');

router.put('/:id', controller.put);    

router.post('/', controller.post);

router.get('/', controller.get)

router.delete('/:id', controller.delete);

module.exports = router;