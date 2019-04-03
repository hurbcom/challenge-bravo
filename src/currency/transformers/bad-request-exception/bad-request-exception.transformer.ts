import { BadRequestException } from '@nestjs/common';

export abstract class BadRequestExceptionTransformer {
    // TODO: Add tests
    static transform(
        exception: BadRequestException,
    ): BadRequestExceptionResponse {
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

        return { errors };
    }
}

interface BadRequestExceptionResponse {
    errors: any;
}
