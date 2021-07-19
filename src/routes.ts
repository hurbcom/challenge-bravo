import Router from "express-promise-router";



import { MoedaController } from './controllers/MoedaController'
import conversionMoedaValidator from "./validators/conversionMoedaValidator";
import createMoedaValidator from "./validators/createMoedaValidator";

const router = Router();

const moedaController = new MoedaController();

router.get("/", moedaController.listAll);

router.get("/conversion", conversionMoedaValidator, moedaController.conversionOfMoeda);

router.post("/", createMoedaValidator, moedaController.create);

router.put("/edit/:id", createMoedaValidator, moedaController.update);

router.delete("/:id", moedaController.delete);

export { router };