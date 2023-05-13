import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentasSchema } from "../schemas/rentals.schema.js";
import { getRent, postRent } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRent)
rentalsRouter.post("/rentals", validateSchema(rentasSchema), postRent)

export default rentalsRouter