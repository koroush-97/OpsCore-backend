import { QcReport } from "../models/QcReport.js";

/**
 * ثبت یک گزارش بازرسی کیفی جدید
 */
export const createReport = async (payload) => {
  // ۱. محاسبه نرخ قبولی (Pass Rate)
  // اگر از فرانت نیامده باشد، خودمان با دقت یک رقم اعشار محاسبه می‌کنیم
  let calculatedPassRate = payload.passRate;

  if (calculatedPassRate === undefined || calculatedPassRate === null) {
    const totalTested = payload.testedToday;
    const passed = payload.standardPassed;

    calculatedPassRate =
      totalTested > 0 ? Number(((passed / totalTested) * 100).toFixed(1)) : 0;
  }

  // ۲. ذخیره در دیتابیس
  const newReport = await QcReport.create({
    ...payload,
    passRate: calculatedPassRate,
  });

  return newReport;
};

/**
 * دریافت آخرین گزارش ثبت شده
 * (برای نمایش در کامپوننت کارت خلاصه QC)
 */
export const getLatestReport = async () => {
  // مرتب‌سازی بر اساس زمان ایجاد (نزولی) و برداشتن اولین مورد
  const latest = await QcReport.findOne().sort({ createdAt: -1 });
  return latest;
};

/**
 * دریافت تاریخچه گزارش‌ها (در صورت نیاز به لیست یا نمودار در آینده)
 */
export const getAllReports = async (limit = 10) => {
  return await QcReport.find().sort({ createdAt: -1 }).limit(limit);
};
