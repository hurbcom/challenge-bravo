import type { Request, Response } from "express";
import logger from "../helpers/Logger";

export const errorHandler = (err: Error, _: Request, res: Response) => {
    logger.error(err.stack);
    res.status(500).send({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};
