import "dotenv/config";
import 'express-async-errors'
import env from "./config/envConfig";
import express from "express";
import redis from "./database/redis";

import currencyRoutes from "./routes/currencyRoute";
import errorMiddleware from "./middlewares/error";

redis.connect();
const app = express();

app.use(express.json());

app.use(currencyRoutes);
app.use(errorMiddleware)

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
