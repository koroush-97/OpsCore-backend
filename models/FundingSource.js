import mongoose from "mongoose";

const isNonNegativeRial = (value) => Number.isSafeInteger(value) && value >= 0;

const fundingSourceSchema = new mongoose.Schema(
  {
    // Stable identifier used by purchase orders, for example FS-01.
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["BANK_ACCOUNT", "PETTY_CASH", "BANK_LC"],
    },

    // Spendable balance in Rials; reserved orders are already deducted.
    balance: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: isNonNegativeRial,
        message: "Balance must be a non-negative whole number of Rials.",
      },
    },

    // Null means the ceiling has not been defined.
    ceilingAmount: {
      type: Number,
      default: null,
      validate: {
        validator: (value) => value == null || isNonNegativeRial(value),
        message: "Ceiling must be a non-negative whole number of Rials.",
      },
    },

    accountNumberMasked: {
      type: String,
      trim: true,
      default: "",
    },

    subtitle: {
      type: String,
      trim: true,
      default: "",
    },

    currency: {
      type: String,
      enum: ["IRR"],
      default: "IRR",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

fundingSourceSchema.index({ isActive: 1, type: 1 });

const FundingSource =
  mongoose.models.FundingSource ||
  mongoose.model("FundingSource", fundingSourceSchema);

export default FundingSource;
