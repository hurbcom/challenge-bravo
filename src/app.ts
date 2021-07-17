import express from "express";

import { router } from "./routes";

import {connect} from "./database"

connect();
const app = express();

app.use(express.json());

app.use(router);

export { app }