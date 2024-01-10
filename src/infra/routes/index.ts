import express from "express";
import { Connection } from "mongoose";
import currencyRoutes from "./currency-routes";

const routes = (connection: Connection) => {
    const router = express.Router();

    currencyRoutes(router, connection);

    return router;
};

export default routes;
