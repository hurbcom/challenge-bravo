const express = require('express');
const healthRouter = require('../../health');


const router = express.Router();
router.use('/health', healthRouter);


module.exports = router;
