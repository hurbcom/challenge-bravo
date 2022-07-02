import { Request, Response, NextFunction } from 'express' 
import { AppError } from '../errors/appError';
import "express-async-errors";
import { QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

export const errorMiddleware = (err: any, request: Request, response: Response, _: NextFunction) => {
    
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      code: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof QueryFailedError) {
    const error = err.driverError as DatabaseError;

    if (error.code === "23505") {
      return response.status(409).json({
        status: "error",
        code: 409,
        message: error.detail,
      });
    }
  }

  console.error(err);
  return response.status(500).json({
    status: "error",
    code: 500,
    message: "Internal server error",
  });
}