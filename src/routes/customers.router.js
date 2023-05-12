import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customersSchema } from "../schemas/customers.schema.js";
import { getCustomers, getCustomersById, postCustomers, putCustomers } from "../controllers/customers.controller.js";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomersById)
customersRouter.post("/customers", validateSchema(customersSchema), postCustomers)
customersRouter.put("/customers/:id", validateSchema(customersSchema), putCustomers)

export default customersRouter