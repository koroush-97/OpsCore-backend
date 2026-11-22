import mongoose from "mongoose";

// تابع تولید خودکار بارنامه: ۱ حرف + ۳ رقم + خط تیره + ۴ رقم (مثال: W482-9104)
const generateWaybillNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetter}${part1}-${part2}`;
};

const inboundReceiptSchema = new mongoose.Schema(
  {
    waybillNumber: {
      type: String,
      default: generateWaybillNumber,
      unique: true,
      index: true,
    },
    purchaseOrderId: {
      type: String,
      default: null,
    },
    materialId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "RAW_MATERIAL",
    },
    unit: {
      type: String,
      required: true,
    },
    warehouse: {
      type: String,
      default: "انبار اصلی",
    },

    // موجودی‌های مورد نیاز جدول فرانت
    rawAvailable: {
      type: Number,
      default: 0,
    },
    inProduction: {
      type: Number,
      default: 0,
    },
    readyForExport: {
      type: Number,
      default: 0,
    },
    defectiveAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const InboundReceipt = mongoose.model(
  "InboundReceipt",
  inboundReceiptSchema,
);
