import { type Request, type Response, type NextFunction } from "express";
import { injectable } from "inversify";
import debug from "debug";

@injectable()
export class ErrorController {
    private readonly logger = debug("app:ErrorController");
    async errorHandler(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        switch (err.name) {
            case "NotFoundError":
                res.status(404).json({ message: err.message });
                break;
            case "BadRequestError":
                res.status(400).json({ message: err.message });
                break;
            default:
                this.logger(err);
                res.status(500).json({ message: "internal server error" });
                break;
        }
    }
}
