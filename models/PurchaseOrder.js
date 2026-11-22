// import mongoose from "mongoose";

// const isPositiveRial = (value) => Number.isSafeInteger(value) && value > 0;

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     id: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     // Business ID of the originating requirement, if any.
//     requirementId: {
//       type: String,
//       trim: true,
//     },

//     materialId: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     sku: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     type: {
//       type: String,
//       required: true,
//       default: "RAW_MATERIAL",
//       trim: true,
//     },

//     unit: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       validate: {
//         validator: (value) => Number.isFinite(value) && value > 0,
//         message: "Quantity must be greater than zero.",
//       },
//     },

//     receivedQuantity: {
//       type: Number,
//       required: true,
//       default: 0,
//       validate: {
//         validator: (value) => Number.isFinite(value) && value >= 0,
//         message: "Received quantity cannot be negative.",
//       },
//     },

//     unitPrice: {
//       type: Number,
//       required: true,
//       validate: {
//         validator: isPositiveRial,
//         message: "Unit price must be a positive whole number of Rials.",
//       },
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//       validate: {
//         validator: isPositiveRial,
//         message: "Total amount must be a positive whole number of Rials.",
//       },
//     },

//     // Look up this ID in FundingSource when the order is created.
//     fundingSourceId: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Snapshot of the source name at the time of ordering.
//     fundingSourceName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     supplierId: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     supplierName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     warehouseId: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     warehouseName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Material delivery state.
//     status: {
//       type: String,
//       enum: ["ORDERED", "PARTIAL", "RECEIVED", "CANCELLED"],
//       default: "ORDERED",
//       required: true,
//     },

//     // RESERVED: deducted from available balance, not yet settled.
//     // SETTLED: payment finalized; RELEASED: reservation returned on cancellation.
//     financialStatus: {
//       type: String,
//       enum: ["RESERVED", "SETTLED", "RELEASED"],
//       required: true,
//     },

//     orderDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },

//     expectedDeliveryDate: {
//       type: Date,
//     },
//   },
//   { timestamps: true },
// );

// purchaseOrderSchema.index({ fundingSourceId: 1, orderDate: -1 });
// purchaseOrderSchema.index({ financialStatus: 1, orderDate: -1 });
// purchaseOrderSchema.index({ requirementId: 1, orderDate: -1 });

// const PurchaseOrder =
//   mongoose.models.PurchaseOrder ||
//   mongoose.model("PurchaseOrder", purchaseOrderSchema);

// export default PurchaseOrder;

import mongoose from "mongoose";

const isPositiveRial = (value) => Number.isSafeInteger(value) && value > 0;

const purchaseOrderSchema = new mongoose.Schema(
  {
    // Business ID of the purchase order (e.g., PO-1718001234)
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => `PO-${Date.now().toString().slice(-6)}`,
    },

    // Business ID of the originating requirement
    requirementId: {
      type: String,
      trim: true,
      default: null,
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

    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: "Quantity must be greater than zero.",
      },
    },

    receivedQuantity: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (value) => Number.isFinite(value) && value >= 0,
        message: "Received quantity cannot be negative.",
      },
    },

    unitPrice: {
      type: Number,
      required: true,
      validate: {
        validator: isPositiveRial,
        message: "Unit price must be a positive whole number of Rials.",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      validate: {
        validator: isPositiveRial,
        message: "Total amount must be a positive whole number of Rials.",
      },
    },

    // Optional for now until funding source integration
    fundingSourceId: {
      type: String,
      trim: true,
      default: null,
    },

    fundingSourceName: {
      type: String,
      trim: true,
      default: "در انتظار تخصیص حساب",
    },

    // Optional for procurement inquiry stage
    supplierId: {
      type: String,
      trim: true,
      default: null,
    },

    supplierName: {
      type: String,
      trim: true,
      default: "نامشخص / در حال استعلام",
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

    // Material delivery state
    status: {
      type: String,
      enum: ["ORDERED", "PARTIAL", "RECEIVED", "CANCELLED"],
      default: "ORDERED",
      required: true,
    },

    // Financial reserve state
    financialStatus: {
      type: String,
      enum: ["RESERVED", "SETTLED", "RELEASED"],
      default: "RESERVED",
      required: true,
    },

    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expectedDeliveryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

purchaseOrderSchema.index({ requirementId: 1, orderDate: -1 });
purchaseOrderSchema.index({ status: 1, orderDate: -1 });

const PurchaseOrder =
  mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
