import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import logger from "../helpers/Logger";

export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info(`${req.method} ${req.originalUrl}`);
            if (Object.keys(req.query).length !== 0) {
                schema.parse(req.query);
            }
            if (Object.keys(req.body).length !== 0) {
                schema.parse(req.body);
            }
            if (Object.keys(req.params).length !== 0) {
                schema.parse(req.params);
            }
            logger.info("validation pass");
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.error(
                    `Validation error: ${JSON.stringify(error.errors)}`
                );
                return res.status(400).json({ errors: error.errors });
            }
            logger.error(`Internal server error: ${error}`);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
