import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export default function errorMiddleware(
    error: Error & Partial<ApiError>,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = error.statusCode ?? 500;
    const message =
        statusCode === 500 ? "Internal server error" : error.message;
    res.status(statusCode).json({ message });
}
