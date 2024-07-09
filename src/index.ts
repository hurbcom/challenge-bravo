import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { routers } from "./Routes";
import { errorHandler } from "./interfaces/middlewares/ErrorHandler";
import logger from "./interfaces/helpers/Logger";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use(morgan("combined"));

const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

const mongoURI = process.env.MONGO_URI as string;
mongoose
    .connect(mongoURI)
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => logger.error("MongoDB connection error:", err));

routers(app);

app.use(errorHandler);

app.disable("x-powered-by");

app.listen(port, () => {
    logger.info(
        `Currency conversion API listening at http://localhost:${port}`
    );
});

export default app;
