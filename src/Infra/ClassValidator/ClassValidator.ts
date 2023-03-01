import { validateOrReject, type ValidationError } from "class-validator";
import BadRequestError from "../Errors/BadRequestError";

export async function classValidator(dataToValidate: object) {
    try {
        await validateOrReject(dataToValidate);
        return true;
    } catch (error) {
        const message = Object.values(
            (error as ValidationError[])[0]?.constraints ?? {}
        )[0];
        throw new BadRequestError(message);
    }
}
