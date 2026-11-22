import mongoose from "mongoose";

const { Schema } = mongoose;

const assemblyOrderSchema = new Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: { type: String, required: true },
      destination: { type: String, required: true },
    },

    product: {
      type: String,
      required: true,
    },

    targetQty: {
      type: Number,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    stage: {
      type: Number,
      default: 0,
    },

    workstation: {
      type: String,
      default: "LINE-01",
    },

    status: {
      type: String,
      enum: ["in_progress", "stopped", "qc", "ready_for_shipping", "completed"],
      default: "in_progress",
    },

    stoppageLogs: [
      {
        reason: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const AssemblyOrder = mongoose.model(
  "AssemblyOrder",
  assemblyOrderSchema,
);
