import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';

import { BadRequestExceptionTransformer } from '../transformers/bad-request-exception/bad-request-exception.transformer';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const badRequestExceptionTransformed = BadRequestExceptionTransformer.transform(
            exception,
        );

        response.status(status).send(badRequestExceptionTransformed);
    }
}
