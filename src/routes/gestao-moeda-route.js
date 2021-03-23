const express = require('express');
const router = express.Router();
const controller = require('../controllers/moeda-controllers');

router.put('/:id', controller.put);