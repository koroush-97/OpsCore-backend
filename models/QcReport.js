import mongoose from "mongoose";

const qcReportSchema = new mongoose.Schema(
  {
    inspectorName: {
      type: String,
      required: [true, "نام بازرس الزامی است"],
      trim: true,
    },
    inspectionDate: {
      type: String,
      required: [true, "تاریخ بازرسی الزامی است"],
      trim: true, // مثلاً: "1405/11/10"
    },
    testedToday: {
      type: Number,
      required: [true, "تعداد تست‌شده الزامی است"],
      min: [0, "تعداد نمی‌تواند منفی باشد"],
    },
    standardPassed: {
      type: Number,
      required: [true, "تعداد تأیید استاندارد الزامی است"],
      min: 0,
    },
    reworkRequired: {
      type: Number,
      required: [true, "تعداد ارجاع جهت اصلاح الزامی است"],
      min: 0,
    },
    scrapped: {
      type: Number,
      required: [true, "تعداد ضایعات الزامی است"],
      min: 0,
    },
    passRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    shiftNote: {
      type: String,
      required: [true, "یادداشت شیفت الزامی است"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const QcReport = mongoose.model("QcReport", qcReportSchema);
