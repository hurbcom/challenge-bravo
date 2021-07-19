import  Router  from "express-promise-router";



import { MoedaController } from './controllers/MoedaController'

const router = Router();

const moedaController = new MoedaController();

router.get("/", moedaController.listAll);

router.get("/conversion", moedaController.conversionOfMoeda);

router.post("/",moedaController.create);

router.put("/edit/:id",moedaController.update);

router.delete("/:id",moedaController.delete);

export { router };