import express from "express";

import { currenciesRoutes } from "./routes/currencies.routes";

const app = express();

app.use(express.json());
app.use("/currencies", currenciesRoutes);

app.listen(process.env.PORT || 3333);
