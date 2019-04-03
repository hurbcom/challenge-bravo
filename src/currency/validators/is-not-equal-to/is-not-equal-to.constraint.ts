import { ValidationArguments, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isNotEqualTo' })
export class IsNotEqualToConstraint {
    // TODO: Add tests
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
