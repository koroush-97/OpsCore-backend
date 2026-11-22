import "dotenv/config";
import mongoose from "mongoose";
import FundingSource from "../models/FundingSource.js";

const readNonNegativeRial = (key, fallback = 0) => {
  const rawValue = process.env[key];

  // اگر متغیر محیطی ست نشده باشد، مقدار پیش‌فرض (fallback) را برمی‌گرداند
  if (rawValue === undefined || rawValue.trim() === "") {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${key} must be a non-negative whole number of Rials.`);
  }

  return value;
};

const readOptionalRial = (key) => {
  const rawValue = process.env[key];
  if (rawValue === undefined || rawValue.trim() === "") {
    return null;
  }
  return readNonNegativeRial(key);
};

const fundingSources = [
  {
    id: "FS-01",
    name: "حساب جاری شرکت (بانک ملت)",
    type: "BANK_ACCOUNT",
    balance: readNonNegativeRial("FS_01_BALANCE", 9000000000),
    ceilingAmount: readOptionalRial("FS_01_CEILING"),
    accountNumberMasked: "1234-****-5678",
    subtitle: "بانک ملت",
    currency: "IRR",
    isActive: true,
  },
  {
    id: "FS-02",
    name: "تنخواه مرکزی کارخانه",
    type: "PETTY_CASH",
    balance: readNonNegativeRial("FS_02_BALANCE", 5000000000),
    ceilingAmount: readOptionalRial("FS_02_CEILING"),
    accountNumberMasked: "",
    subtitle: "تنخواه کارخانه",
    currency: "IRR",
    isActive: true,
  },
  {
    id: "FS-03",
    name: "اعتبار اسنادی ال‌سی بانکی",
    type: "BANK_LC",
    balance: readNonNegativeRial("FS_03_BALANCE", 3000000000),
    ceilingAmount: readOptionalRial("FS_03_CEILING"),
    accountNumberMasked: "LC-9988-7766",
    subtitle: "اعتبار اسنادی بانکی",
    currency: "IRR",
    isActive: true,
  },
];

const seedFundingSources = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment.");
  }

  await mongoose.connect(mongoUri);

  try {
    for (const source of fundingSources) {
      // استفاده از upsert برای ایجاد در صورت عدم وجود
      const result = await FundingSource.updateOne(
        { id: source.id },
        { $setOnInsert: source },
        { upsert: true, runValidators: true },
      );

      if (result.upsertedCount > 0) {
        console.log(
          `Created funding source: ${source.id} - ${source.name} with balance ${source.balance}`,
        );
      } else {
        console.log(`Funding source already exists: ${source.id}`);
      }
    }
    console.log("Funding source seeding completed.");
  } finally {
    await mongoose.disconnect();
  }
};

seedFundingSources().catch((error) => {
  console.error("Funding source seeding failed:", error);
  process.exitCode = 1;
});
