import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const token: String = req.query.Authorization?.toString() || req.headers.authorization?.toString() || '';
    if (token && process.env.SECRET) {
        jwt.verify(token.toString(), process.env.SECRET, (err, decoded: any) => {
            if (err) {
                return res.status(400).json('Invalid or expired token');
            }
            else next();

        });

    } else return res.status(401).json('Unauthorized');
}

const createToken = () => {
    return jwt.sign(
        {
            datetime: new Date().getTime()
        },
        process.env.SECRET || '',
        {
            expiresIn: '2h'
        }
    )
}

export {
    createToken,
    checkAuth
}