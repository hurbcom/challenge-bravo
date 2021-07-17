import { Router } from "express";

import { Moeda } from './models/Moeda';

import { MoedaController } from './controllers/MoedaController'

const router = Router();

const moedaController = new MoedaController();

router.get("/", moedaController.listAll);

router.post("/",moedaController.create);

router.put("/edit/:id",moedaController.update);

router.delete("/:id",moedaController.delete);

export { router };