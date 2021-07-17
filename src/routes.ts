import { Router } from "express";

import { Moeda } from './models/Moeda';

import { MoedaController } from './controllers/MoedaController'

const router = Router();

const moedaController = new MoedaController();

router.get("/", moedaController.listAll);

router.post("/",moedaController.create);

export { router };