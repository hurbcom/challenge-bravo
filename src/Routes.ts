import "express-async-errors";

import express from "express";

const app = express();

app.get("/", (req, res)=> res.send('hello'));

export default app;
