import 'express-async-errors';
import 'reflect-metadata';
import '@container/index';
import 'colors';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/AppError';

import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error?.errorCode ? { code: error.errorCode } : {}),
    });
  }

  console.log(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

export { app };
