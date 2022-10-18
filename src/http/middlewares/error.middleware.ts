import { Request, Response, NextFunction } from 'express';

export function errorMiddleware (error: any, req: Request, res: Response, next: NextFunction) {
  res.status(400).send(`${error}`);
}