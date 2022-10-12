import express, { Application } from "express";

import { Router, Request, Response } from "express";

const routes = (app: Application) => {
    const route = Router();

    route.get("/", (req: Request, res: Response) => {
        res.json({ message: "hello world with Typescript" });
    });

    app.use(route);
};

export const init = () => {
    const app = express();

    routes(app);

    const port = 3000;
    app.listen(port, () => {
        console.log(`Server started at: http://localhost:${port}`);
    });
};
