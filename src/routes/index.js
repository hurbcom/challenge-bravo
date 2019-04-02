const express = require('express');
const router = express.Router();
const baseRouteApi = '/api'

const coinController = require('../controllers/coinController')

router.get(`${baseRouteApi}/convert`, coinController.convert)

module.exports = router