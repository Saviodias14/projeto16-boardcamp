import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentasSchema } from "../schemas/rentals.schema.js";
import { deleteRent, finalizeRent, getRent, postRent } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRent)
rentalsRouter.post("/rentals", validateSchema(rentasSchema), postRent)
rentalsRouter.post("/rentals/:id/return", finalizeRent)
rentalsRouter.delete("/rentals/:id", deleteRent)

export default rentalsRouter