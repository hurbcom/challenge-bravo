import { Router } from "express";

import { quotationRoutes } from "./quotation.routes";

const router = Router();

router.use("/quotations", quotationRoutes);

export { router };
