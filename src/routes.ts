import { Router } from "express";

const router = Router();

router.get('/', (req, res) => res.send(`Olá viajante!`));

export default router;