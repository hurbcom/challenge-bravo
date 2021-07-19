import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";

import { router } from "./routes";

import { errors } from 'celebrate';

import {connect} from "./database"
import { AppError } from "./AppError";

connect();
const app = express();

app.use(express.json());

app.use(router);

app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          message: err.message
        })
      }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  })

export { app }