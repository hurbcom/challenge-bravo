import express from "express";

import { quotationRoutes } from "./routes/quotation.routes";

const app = express();

app.use(express.json());

app.use("/quotations", quotationRoutes);

app.listen(3333, () => console.log("server running on port 3333"));
