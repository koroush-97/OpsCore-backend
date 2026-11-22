import Joi from "joi";

export const createInboundReceiptSchema = Joi.object({
  id: Joi.string().allow(null, "").optional(),
  materialId: Joi.string().required(),
  name: Joi.string().required(),
  sku: Joi.string().required(),
  type: Joi.string().default("RAW_MATERIAL"),
  unit: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  warehouseName: Joi.string().allow(null, "").optional(),
  warehouseId: Joi.string().allow(null, "").optional(),
  requirementId: Joi.string().allow(null, "").optional(),
}).unknown(true);
