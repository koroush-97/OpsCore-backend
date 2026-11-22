import mongoose from "mongoose";

const requiredMaterialSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    materialId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      default: "RAW_MATERIAL",
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    minStockLevel: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    maxStockLevel: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    suggestedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    urgency: {
      type: String,
      enum: ["CRITICAL", "HIGH", "NORMAL", "LOW"],
      default: "CRITICAL",
    },

    warehouseId: {
      type: String,
      required: true,
      trim: true,
    },

    warehouseName: {
      type: String,
      required: true,
      trim: true,
    },
    // estimate price for buy material
    estimatedUnitPrice: {
      type: Number,
      required: [true, "Estimated unit price is required."],
      min: [0, "Estimated unit price cannot be negative."],
      validate: {
        validator: (v) => Number.isSafeInteger(v) && v >= 0,
        message: "Price must be a non-negative whole integer in Rials.",
      },
    },

    // An ordered requirement remains available for audit.
    status: {
      type: String,
      enum: ["OPEN", "ORDERED"],
      default: "OPEN",
      required: true,
    },

    // Stores the business ID of the current purchase order.
    purchaseOrderId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

requiredMaterialSchema.index({ status: 1, createdAt: -1 });

const RequiredMaterial =
  mongoose.models.RequiredMaterial ||
  mongoose.model("RequiredMaterial", requiredMaterialSchema);

export default RequiredMaterial;
