import { Request, Response } from "express";
import { createToken } from "../../Middleware/auth";

class AuthController {
    public async login(req: Request, res: Response) {
        let body: any = req.body;
        if (body.login == process.env.LOGIN && body.password == process.env.PASS) {
            let token = createToken();
            res.status(200).json({ token })
        } else res.status(401).json('Unauthorized');
    }

    public async refresh(req: Request, res: Response) {
        let token = createToken();
        res.status(200).json({ token })
    }
}

export const authController = new AuthController();