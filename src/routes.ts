import Router from "express-promise-router";



import { MoedaController } from './controllers/MoedaController'
import conversionMoedaValidator from "./validators/conversionMoedaValidator";
import createMoedaValidator from "./validators/createMoedaValidator";

const router = Router();

const moedaController = new MoedaController();

router.get("/coin", moedaController.listAll);

router.get("/coin/conversion", conversionMoedaValidator, moedaController.conversionOfMoeda);

router.post("/coin", createMoedaValidator, moedaController.create);

router.put("/coin/edit/:id", createMoedaValidator, moedaController.update);

router.delete("/coin/:id", moedaController.delete);

export { router };