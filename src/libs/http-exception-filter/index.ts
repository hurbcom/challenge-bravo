import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { HttpErrorType } from './errorType';
import { Response } from 'express';

const logger = new Logger('HttpExceptionFilter');

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: Error | HttpException, host: ArgumentsHost) {
        if (!(exception instanceof Error)) exception = new Error(exception);
        logger.error(
            exception.stack
                ? exception.stack
                : `${exception.name}: ${exception.message}`,
        );

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        if (exception instanceof HttpException) {
            const status = +exception.getStatus();
            let { errorType, message, error, errors, extraInfo } =
                exception.getResponse?.() as any;

            if (!errorType) {
                errorType = HttpErrorType[status];
                errorType = errorType ?? 'UNEXPECTED_ERROR';
            }

            let errorResponse = {
                statusCode: status,
                errorType,
                message,
                error,
                errors,
                extraInfo,
            };

            if (extraInfo && Object.values(extraInfo).length === 0)
                delete errorResponse.extraInfo;

            return response.status(status).json(errorResponse);
        }

        response.status(500).json({
            statusCode: 500,
            errorType: 'INTERNAL_SERVER_ERROR',
            message: exception.message,
        });
    }
}
