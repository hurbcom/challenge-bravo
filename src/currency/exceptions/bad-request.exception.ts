import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const errors = {};
        const exceptionErrors = exception.getResponse()['message'];

        for (const exceptionError of exceptionErrors) {
            const property = exceptionError['property'];
            const constraints = exceptionError['constraints'];

            if (!errors.hasOwnProperty(property)) {
                errors[property] = {};
            }

            for (const constraintKey of Object.keys(constraints)) {
                const constraintMessage = constraints[constraintKey];
                errors[property][constraintKey] = constraintMessage;
            }
        }

        response.status(status).send({
            errors,
        });
    }
}
