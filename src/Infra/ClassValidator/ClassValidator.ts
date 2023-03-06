import { validateOrReject, type ValidationError } from "class-validator";
import BadRequestError from "../Errors/BadRequestError";

export async function classValidator(dataToValidate: object) {
    try {
        await validateOrReject(dataToValidate);
        return true;
    } catch (error) {
        let message = "Valitation error";
        const classValidatorConstraints = (error as ValidationError[])[0]
            ?.constraints;
        if (classValidatorConstraints != null) {
            message = Object.values(classValidatorConstraints)[0];
        }

        throw new BadRequestError(message);
    }
}
