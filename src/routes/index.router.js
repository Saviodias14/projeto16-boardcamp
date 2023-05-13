import { Router } from "express";
import gamesRouter from "./games.router.js";
import customersRouter from "./customers.router.js";
import rentalsRouter from "./rentals.router.js";

const router = Router()

router.use(gamesRouter)
router.use(customersRouter)
router.use(rentalsRouter)

export default router