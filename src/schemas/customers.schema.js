import Joi from "joi";

export const customersSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/),
    birthday: Joi.date().required()
})