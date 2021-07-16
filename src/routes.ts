import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
    return response.json({ mensage: "Helo World" })
})

export { router };