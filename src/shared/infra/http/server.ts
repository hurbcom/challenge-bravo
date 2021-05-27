import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";

import "express-async-errors";
import { AppError } from "../../errors/AppError";
import createConnection from "../typeorm";
import "../../container";
import { routes } from "./routes";

const app = express();

createConnection().then((conn) => {
  console.log("database connected!");
  conn.runMigrations();
});

const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${error.message}`,
    });
  }
);

app.listen(PORT, () => console.log(`server is running in port ${PORT}`));
