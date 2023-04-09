import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiOkResponse,
    getSchemaPath,
    ApiExtraModels,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';

class GlobalEmptyResponseDto {}

export const ApiGeneralDocumentation = <TModel extends Type<any>>({
    isArray,
    model,
}: {
    isArray?: boolean;
    model?: TModel | GlobalEmptyResponseDto;
}) => {
    let okResponse: object = null;

    if (model) {
        okResponse = {
            $ref: getSchemaPath(model as TModel),
        };

        if (isArray) {
            okResponse = {
                type: 'array',
                items: { $ref: getSchemaPath(model as TModel) },
            };
        }
    } else {
        model = GlobalEmptyResponseDto;
    }

    console.log(okResponse);

    const defaultDecorators = [
        ApiExtraModels(model as TModel),
        ApiOkResponse({
            description: 'Success response',
        }),
        ApiBadRequestResponse({
            description: 'Bad request',
            schema: {
                properties: {
                    statusCode: {
                        type: 'string',
                    },
                    errorType: {
                        type: 'string',
                    },
                    message: {
                        type: 'string',
                    },
                    error: {
                        type: 'string',
                    },
                },
            },
        }),
        ApiNotFoundResponse({
            description: 'Not found',
            schema: {
                properties: {
                    statusCode: {
                        type: 'string',
                        default: '404',
                    },
                    errorType: {
                        type: 'string',
                        default: 'NOT_FOUND',
                    },
                    message: {
                        type: 'string',
                    },
                    error: {
                        type: 'string',
                    },
                },
            },
        }),
        ApiInternalServerErrorResponse({
            description: 'Server error',
            schema: {
                properties: {
                    statusCode: {
                        type: 'string',
                        default: '500',
                    },
                    errorType: {
                        type: 'string',
                        default: 'INTERNAL_SERVER_ERROR',
                    },
                    message: {
                        type: 'string',
                    },
                    error: {
                        type: 'string',
                    },
                },
            },
        }),
    ];

    return applyDecorators(...defaultDecorators);
};
