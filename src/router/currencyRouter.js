const express = require('express');
const router = express.Router();

const currencyController = require('../controller/currencyController');
const authService = require('../service/authService');
const rateLimit = require("express-rate-limit");

//For delimit number of request of API
const apiLimiter = rateLimit({
  windowMs: 600,
  max: 2,
  message: "Too many calls, please try again after an second"
});

router.get('/authenticate', authService.authenticate,apiLimiter);
router.get('/currencies', authService.isAuthenticated, apiLimiter ,currencyController.currencies);
router.get('/currency-convert', authService.isAuthenticated, apiLimiter, currencyController.currencyConvert);
router.post('/currency-suported', authService.isAuthenticated, apiLimiter, currencyController.currencySuported);
module.exports = app => app.use("/", router);
