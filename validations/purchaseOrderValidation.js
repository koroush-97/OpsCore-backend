// // import Joi from "joi";

// // export const createPurchaseOrderSchema = Joi.object({
// //   requirementId: Joi.string().trim().allow(null, "").optional(),
// //   materialId: Joi.string().trim().required().messages({
// //     "any.required": "Material ID is required",
// //   }),
// //   name: Joi.string().trim().required().messages({
// //     "any.required": "Material name is required",
// //   }),
// //   sku: Joi.string().trim().required().messages({
// //     "any.required": "SKU is required",
// //   }),
// //   type: Joi.string().trim().default("RAW_MATERIAL"),
// //   unit: Joi.string().trim().required().messages({
// //     "any.required": "Unit is required",
// //   }),
// //   quantity: Joi.number().positive().required().messages({
// //     "number.base": "Quantity must be a valid number",
// //     "number.positive": "Quantity must be greater than zero",
// //     "any.required": "Quantity is required",
// //   }),
// //   unitPrice: Joi.number().integer().positive().required().messages({
// //     "number.base": "Unit price must be a valid number of Rials",
// //     "number.positive": "Unit price must be greater than zero",
// //     "any.required": "Unit price is required",
// //   }),
// //   fundingSourceId: Joi.string().trim().required().messages({
// //     "any.required": "Funding source is required",
// //   }),
// //   supplierId: Joi.string().trim().required().messages({
// //     "any.required": "Supplier ID is required",
// //   }),
// //   supplierName: Joi.string().trim().required().messages({
// //     "any.required": "Supplier name is required",
// //   }),
// //   warehouseId: Joi.string().trim().required().messages({
// //     "any.required": "Warehouse ID is required",
// //   }),
// //   warehouseName: Joi.string().trim().required().messages({
// //     "any.required": "Warehouse name is required",
// //   }),
// //   expectedDeliveryDate: Joi.date().iso().optional(),
// // });
// import Joi from "joi";

// export const createPurchaseOrderSchema = Joi.object({
//   // Requirement business ID originating from Tab 1 (e.g., REQ-01)
//   requirementId: Joi.string().trim().required().messages({
//     "any.required": "Requirement ID is required",
//     "string.empty": "Requirement ID cannot be empty",
//   }),

//   // Optional overrides if sent directly from Tab 1
//   materialId: Joi.string().trim().optional(),
//   name: Joi.string().trim().optional(),
//   sku: Joi.string().trim().optional(),
//   type: Joi.string().trim().default("RAW_MATERIAL"),
//   unit: Joi.string().trim().optional(),
//   quantity: Joi.number().positive().optional(),
//   unitPrice: Joi.number().positive().optional(),

//   // Optional fields for current phase (will be utilized in next phase)
//   fundingSourceId: Joi.string().trim().allow(null, "").optional(),
//   supplierId: Joi.string().trim().allow(null, "").optional(),
//   supplierName: Joi.string().trim().allow(null, "").optional(),
//   warehouseId: Joi.string().trim().allow(null, "").optional(),
//   warehouseName: Joi.string().trim().allow(null, "").optional(),
//   expectedDeliveryDate: Joi.date().iso().allow(null).optional(),
// });
import Joi from "joi";

export const createPurchaseOrderSchema = Joi.object({
  requirementId: Joi.string().trim().allow(null, "").optional(),
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
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.positive": "Quantity must be greater than zero",
    "any.required": "Quantity is required",
  }),
  unit: Joi.string().trim().required().messages({
    "any.required": "Unit is required",
  }),
  // 👇 این فیلد اضافه شود:
  estimatedUnitPrice: Joi.number().min(0).optional().default(0),
  unitPrice: Joi.number().min(0).optional().default(0), // در صورت نیاز به پشتیبانی از هر دو نام

  warehouseId: Joi.string().trim().allow(null, "").optional(),
  warehouseName: Joi.string().trim().allow(null, "").optional(),
  supplierName: Joi.string().trim().allow(null, "").optional(),
  notes: Joi.string().trim().allow(null, "").optional(),
});
