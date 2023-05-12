import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gamesSchema } from "../schemas/games.schema.js";
import { getGames, postGames } from "../controllers/games.controller.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(gamesSchema), postGames)

export default gamesRouter