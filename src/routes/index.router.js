import { Router } from "express";
import gamesRouter from "./games.router.js";

const router = Router()

router.use(gamesRouter)

export default router