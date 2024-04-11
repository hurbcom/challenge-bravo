import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { BadRequestError } from "../utils/apiError";

const requestValidation =
    (schema: ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const body = Object.keys(req.body).length;
        const params = Object.keys(req.params).length;
        const query = Object.keys(req.query).length;
        if (req.method !== "GET" && !body && !params && !query) {
            throw new BadRequestError("Please fill out all the fields");
        }
        try {
            if (body) {
                await schema.validateAsync({ body: req.body });
            }
            if (params) {
                await schema.validateAsync({ params: req.params });
            }
            if (query) {
                await schema.validateAsync({ query: req.query });
            }

            return next();
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    };

export default requestValidation;
