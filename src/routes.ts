import {  Router } from "express";

import {Moeda} from './models/Moeda'

const router = Router();

router.get("/", async (request, response) => {
    const moeda = await Moeda.find();

    response.json(moeda);

})

router.post("/", async (request, response)=>{
        const {name, sigla, valorEmReal } = request.body;

    const respo = await new Moeda({name, sigla, valorEmReal}).save();
    response.json( respo);
})

export { router };