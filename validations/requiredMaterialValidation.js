import Joi from "joi";

export const createRequiredMaterialSchema = Joi.object({
  materialId: Joi.string().trim().required().messages({
    "any.required": "Material ID is required",
  }),
  name: Joi.string().trim().required().messages({
    "any.required": "Material name is required",
  }),
  sku: Joi.string().trim().required().messages({
    "any.required": "SKU is required",
  }),
  type: Joi.string().trim().default("RAW_MATERIAL"),
  unit: Joi.string().trim().required().messages({
    "any.required": "Unit is required",
  }),
  currentStock: Joi.number().min(0).default(0),
  minStockLevel: Joi.number().min(0).default(0),
  maxStockLevel: Joi.number().min(0).default(0),
  suggestedAmount: Joi.number().min(0).required().messages({
    "any.required": "Suggested amount is required",
  }),
  // 🟢 فیلد قیمت تخمینی هر واحد به ریال
  estimatedUnitPrice: Joi.number().integer().min(0).required().messages({
    "number.base": "Estimated unit price must be a number",
    "number.min": "Estimated unit price cannot be negative",
    "any.required": "Estimated unit price is required",
  }),
  urgency: Joi.string()
    .valid("CRITICAL", "HIGH", "NORMAL", "LOW")
    .default("CRITICAL"),
  warehouseId: Joi.string().trim().required().messages({
    "any.required": "Warehouse ID is required",
  }),
  warehouseName: Joi.string().trim().required().messages({
    "any.required": "Warehouse name is required",
  }),
});

// در صورت آپدیت، قیمت هم اختیاری می‌شود
export const updateRequiredMaterialSchema = createRequiredMaterialSchema.fork(
  [
    "materialId",
    "name",
    "sku",
    "unit",
    "suggestedAmount",
    "estimatedUnitPrice", // 🟢 به لیست optionalها اضافه شد
    "warehouseId",
    "warehouseName",
  ],
  (schema) => schema.optional(),
);
