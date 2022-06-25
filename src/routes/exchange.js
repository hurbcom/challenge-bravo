import express from "express";
import exchangeController from "../controllers/exchangeController.js";

const route = express.Router();

route
    .get('/exchange', exchangeController.exchange)

export default route;
