import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import RequiredMaterial from "../models/RequiredMaterial.js";

// Load environment variables
dotenv.config();

const sampleMaterials = [
  {
    id: "RM-001",
    materialId: "MAT-HDPE-01",
    warehouseId: "WH-RAW-01",
    name: "گرانول پلی‌اتیلن سنگین (HDPE)",
    sku: "RAW-HDPE-001",
    warehouseName: "انبار مواد خام مرکزی",
    currentStock: 1200,
    minStockLevel: 5000,
    suggestedAmount: 8000,
    estimatedUnitPrice: 680000, // ۶۸۰,۰۰۰ ریال به ازای هر کیلوگرم
    unit: "کیلوگرم",
    urgency: "CRITICAL",
    status: "OPEN",
  },
  {
    id: "RM-002",
    materialId: "MAT-ALUM-380",
    warehouseId: "WH-CAST-02",
    name: "شمش آلومینیوم آلیاژی A380",
    sku: "RAW-ALUM-380",
    warehouseName: "انبار ریخته‌گری",
    currentStock: 3400,
    minStockLevel: 4500,
    suggestedAmount: 5000,
    estimatedUnitPrice: 1850000, // ۱,۸۵۰,۰۰۰ ریال به ازای هر کیلوگرم
    unit: "کیلوگرم",
    urgency: "HIGH",
    status: "OPEN",
  },
  {
    id: "RM-003",
    materialId: "MAT-ST-304",
    warehouseId: "WH-SHEET-03",
    name: "ورق استنلس استیل ۳۰۴ ضخامت ۲ میل",
    sku: "RAW-ST-304-2M",
    warehouseName: "انبار ورق و برشکاری",
    currentStock: 180,
    minStockLevel: 200,
    suggestedAmount: 500,
    estimatedUnitPrice: 14500000, // ۱۴,۵۰۰,۰۰۰ ریال به ازای هر شیت
    unit: "شیت",
    urgency: "NORMAL",
    status: "OPEN",
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log("Cleaning up existing required materials...");
    await RequiredMaterial.deleteMany({});

    console.log("Seeding sample required materials with unit prices...");
    const createdMaterials = await RequiredMaterial.insertMany(sampleMaterials);

    console.log(
      `Successfully seeded ${createdMaterials.length} required materials with prices.`,
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding required materials:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedData();
