import Joi from "joi";

/**
 * Validate the user-editable fields of a new assembly order.
 * The frontend displays a Jalali date but sends its converted ISO date.
 */
export const createOrderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().trim().min(1).required(),
    destination: Joi.string().trim().min(1).required(),
  }).required(),

  product: Joi.string().trim().min(1).required(),
  targetQty: Joi.number().integer().min(1).required(),
  deadline: Joi.date().iso().required(),
});
