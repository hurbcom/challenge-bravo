import express from "express";
import { Connection } from "mongoose";
import routes from "./infra/routes";
import cors from "cors";

const port = process.env.PORT ?? 3003;

const setupApp = (connection: Connection) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(routes(connection));

    app.listen(port, function () {
        console.log("Express server listening on port: ", port);
    });
};

export default setupApp;
