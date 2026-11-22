import mongoose from "mongoose";

const materialReceiptSchema = new mongoose.Schema(
  {
    // Unique receipt ID (e.g., RC-9010)
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Associated Purchase Order ID (e.g., PO-1405-02)
    purchaseOrderId: {
      type: String,
      required: true,
      trim: true,
    },
    // Material identifier (e.g., MAT-102)
    materialId: {
      type: String,
      required: true,
      trim: true,
    },
    // Material name
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // SKU code
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    // Material type
    type: {
      type: String,
      required: true,
      default: "RAW_MATERIAL",
      trim: true,
    },
    // Measurement unit
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    // Received quantity in this delivery
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    // Quantity discrepancy if any (shortage or excess)
    discrepancy: {
      type: Number,
      default: 0,
    },
    // Quality control status
    qualityStatus: {
      type: String,
      enum: ["APPROVED", "REJECTED", "PENDING_INSPECTION"],
      default: "APPROVED",
    },
    // Supplier details
    supplierId: {
      type: String,
      required: true,
      trim: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    // Warehouse destination
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
    // Person who registered the receipt (Warehouse keeper)
    registeredBy: {
      type: String,
      required: true,
      trim: true, // e.g., "Reza ahmadi - Warehouse"
    },
    // Receipt date and time
    receiptDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Additional notes or inspection remarks
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

const MaterialReceipt = mongoose.model(
  "MaterialReceipt",
  materialReceiptSchema,
);

export default MaterialReceipt;
