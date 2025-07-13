import { ZodIssue } from "zod";
import { GenericError } from "../../../plugins/errors";

export class ValidationError extends GenericError {
    readonly statusCode = 400;

    constructor(public readonly issues: ZodIssue[]) {
        super("Validation failed");
    }

    serialize() {
        return {
            message: this.message,
            issues: this.issues.map(i => {
                path: i.path.join("."),
                message: i.message
            })
        }
    }
}