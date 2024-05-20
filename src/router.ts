import { Router } from "express";
import { conversionController } from "./app/controllers/ConversionController";
import { currencyController } from "./app/controllers/CurrencyController";
import { validate } from 'express-validation';
import { authController } from "./app/controllers/AuthController";
import { checkAuth } from "./Middleware/auth";
import { conversion, add, login } from "./Middleware/validation";
const router: Router = Router()


//Routes
router.get("/conversion", validate(conversion), conversionController.conversion);

router.post("/add", validate(add), checkAuth, currencyController.add);
router.delete("/remove/:asset", checkAuth, currencyController.remove);


router.post("/login", validate(login), authController.login);
router.get("/refresh", checkAuth, authController.refresh);

export { router };