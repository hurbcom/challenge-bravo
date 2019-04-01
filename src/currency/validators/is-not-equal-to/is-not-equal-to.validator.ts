import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsNotEqualToConstraint } from './is-not-equal-to.constraint';

export const IsNotEqualTo = (config: any, options?: ValidationOptions) => (
    object: object,
    propertyName: string,
) => {
    registerDecorator({
        options,
        propertyName,
        target: object.constructor,
        constraints: [config],
        validator: IsNotEqualToConstraint,
    });
};
