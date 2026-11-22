// seed/seedPersonnel.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Personnel from "../models/Personnel.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// چند لیست ساده برای واقعی‌نمایی داده‌ها
const firstNames = [
  "علی",
  "محمد",
  "حسین",
  "رضا",
  "مهدی",
  "امیر",
  "سعید",
  "یاسر",
  "حامد",
  "حسن",
  "فاطمه",
  "زهرا",
  "مریم",
  "نرگس",
  "ریحانه",
  "الهام",
  "سارا",
  "محدثه",
  "سحر",
  "نازنین",
];
const lastNames = [
  "رضایی",
  "محمدی",
  "حسینی",
  "کریمی",
  "جعفری",
  "احمدی",
  "قاسمی",
  "موسوی",
  "اکبری",
  "عباسی",
  "صادقی",
  "شریفی",
  "مرادی",
  "هاشمی",
  "یوسفی",
  "رستمی",
  "کاظمی",
  "زارع",
  "سلیمانی",
  "امینی",
];

const departmentsByJob = {
  "مدیر منابع انسانی": "منابع انسانی",
  "مدیر عملیاتی": "عملیات",
  "مدیر خط": "تولید",
  سرپرست: "تولید",
  "کارگر خط تولید": "تولید",
  راننده: "لجستیک",
  منشی: "اداری",
  "انبار دار": "انبار",
  "کارمند بیمه": "منابع انسانی",
  حسابدار: "مالی",
  بازاریاب: "فروش",
  بازرس: "کنترل کیفیت",
  بایگانی: "اداری",
};

const contractTypes = ["temporary", "permanent", "probation", "hourly"];
const shiftTypes = ["morning", "evening", "night", "rotating"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function pad(n, len = 4) {
  return String(n).padStart(len, "0");
}

// تولید کد ملی 10 رقمی (واقعی‌نما، نه لزوماً معتبر الگوریتمی)
function genNationalCode(i) {
  return String(1000000000 + i).slice(0, 10);
}

function genMobile(i) {
  // 0912xxxxxxx
  const base = 1200000 + i; // برای یونیک شدن
  return "0912" + String(base).padStart(7, "0");
}

function genSheba(i) {
  // IR + 24 digits
  const num = String(10_0000_0000_0000_0000_0000_0000n + BigInt(i)).padStart(
    24,
    "0",
  );
  return "IR" + num;
}

function genCard(i) {
  // 16 digits (واقعی‌نما)
  const num = String(6037990000000000n + BigInt(i)).padStart(16, "0");
  return num;
}

function randomHireDate() {
  // بین 2018 تا 2026
  const year = rand(2018, 2026);
  const month = rand(1, 12);
  const day = rand(1, 28);
  return new Date(Date.UTC(year, month - 1, day));
}

function baseSalaryForJob(jobTitle) {
  // عددها تقریبی و برای تست UI
  if (jobTitle.includes("مدیر")) return rand(80, 140) * 1_000_000;
  if (jobTitle === "سرپرست") return rand(45, 70) * 1_000_000;
  if (jobTitle === "حسابدار") return rand(40, 65) * 1_000_000;
  if (jobTitle === "کارمند بیمه") return rand(35, 55) * 1_000_000;
  if (jobTitle === "بازاریاب") return rand(35, 60) * 1_000_000;
  if (jobTitle === "انبار دار") return rand(30, 50) * 1_000_000;
  if (jobTitle === "منشی") return rand(28, 45) * 1_000_000;
  if (jobTitle === "بازرس") return rand(35, 55) * 1_000_000;
  if (jobTitle === "بایگانی") return rand(27, 40) * 1_000_000;
  if (jobTitle === "راننده") return rand(30, 55) * 1_000_000;
  // کارگر خط تولید
  return rand(25, 40) * 1_000_000;
}

function makePersonnelDoc(i, jobTitle) {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);

  const personnelCode = String(100 + i); // 101..180
  const department = departmentsByJob[jobTitle] || "عمومی";

  // برای توزیع واقع‌نما: تولید/راننده بیشتر شیفتی
  const shiftType =
    jobTitle === "کارگر خط تولید" || jobTitle === "راننده"
      ? pick(["morning", "evening", "night", "rotating"])
      : pick(["morning", "morning", "morning", "evening"]);

  const contractType = jobTitle.includes("مدیر")
    ? pick(["permanent", "permanent", "temporary"])
    : pick(contractTypes);

  return {
    personnelCode,
    personalInfo: {
      firstName,
      lastName,
      nationalCode: genNationalCode(i),
      birthDate: "", // اگر لازم داشتی بعداً پر می‌کنیم
      mobile: genMobile(i),
      emergencyContact: { name: "", phone: "", relation: "" },
      maritalStatus: pick(["single", "married"]),
      childrenCount: rand(0, 3),
      homeAddress: "",
      postalCode: "",
    },
    jobContract: {
      department,
      jobTitle,
      workplaceLocation: "",
      contractType,
      hireDate: randomHireDate(),
      contractEndDate: null,
      shiftType,
      status: "active",
    },
    financialProfile: {
      baseSalary30Days: baseSalaryForJob(jobTitle),
      socialSecurityNumber: "",
      previousInsuranceMonths: rand(0, 240),
      shebaNumber: genSheba(i),
      cardNumber: genCard(i),
      accountNumber: "",
      bankName: "",
    },
  };
}

async function run() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected for seeding.");

  // اگر می‌خوای هر بار از صفر بسازی، این خط را فعال کن:
  // await Personnel.deleteMany({});
  // console.log("Personnel collection cleared.");

  const distribution = [
    ["مدیر منابع انسانی", 1],
    ["مدیر عملیاتی", 1],
    ["مدیر خط", 2],
    ["سرپرست", 4],
    ["منشی", 3],
    ["انبار دار", 4],
    ["کارمند بیمه", 3],
    ["حسابدار", 3],
    ["بازاریاب", 4],
    ["بازرس", 3],
    ["بایگانی", 3],
    ["راننده", 10],
    ["کارگر خط تولید", 36],
  ];

  const docs = [];
  let idx = 1;
  for (const [jobTitle, count] of distribution) {
    for (let c = 0; c < count; c++) {
      docs.push(makePersonnelDoc(idx, jobTitle));
      idx++;
    }
  }

  // جلوگیری از ثبت تکراری (اگر قبلاً داده داری)
  // اینجا ساده عمل می‌کنیم: فقط آن‌هایی که personnelCode شان وجود ندارد insert می‌کنیم
  for (const d of docs) {
    const exists = await Personnel.findOne({
      personnelCode: d.personnelCode,
    }).select("_id");
    if (!exists) {
      await Personnel.create(d);
    }
  }

  console.log(`Seed done. Attempted: ${docs.length}`);
  await mongoose.disconnect();
  console.log("Mongo disconnected.");
}

run().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
