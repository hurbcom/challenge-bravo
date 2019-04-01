import { ValidationArguments, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint()
export class IsNotEqualToConstraint {
    async validate(
        value: string,
        { constraints, object }: ValidationArguments,
    ) {
        const [pathValue] = constraints;
        const valueToCompare = object[pathValue];

        return valueToCompare !== value;
    }

    defaultMessage({ constraints, property }: ValidationArguments) {
        const [pathValue] = constraints;

        return `"${property}" property value should be different from "${pathValue}" property value`;
    }
}
