import { Router } from "express";
import gamesRouter from "./games.router.js";
import customersRouter from "./customers.router.js";

const router = Router()

router.use(gamesRouter)
router.use(customersRouter)

export default router