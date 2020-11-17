import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { ValidationError } from 'yup';

import routes from './routes';
import logger from './utils/logger';
import './database';

/**
 * Global error handler.
 *
 * @param {Error} err the error object
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Function} next express next handler
 */
function errorHandler(err, req, res, next) {
    // Yup validation errors
    if (err instanceof ValidationError) {
        err.statusCode = 400;
        err.logLevel = 'warn';
        err.message = 'Erro de validação';
    }

    const response = {
        error: err.statusCode ? err.message : 'Erro inesperado',
        statusCode: err.statusCode || 500
    };

    // Additional error details returned for non production environments
    if (process.env.NODE_ENV !== 'production') {
        response.validationErrors = err.errors;
    }

    res.status(err.statusCode || 500).json(response);

    logger[err.logLevel || 'error'](err);
}

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(cors());
    }

    routes() {
        this.server.use(routes);
        this.server.use(errorHandler);
    }
}

export default new App().server;
