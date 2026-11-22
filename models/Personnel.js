import mongoose from "mongoose";

const personnelSchema = new mongoose.Schema(
  {
    // کلید اصلی شناسایی در سیستم و جستجوی سریع
    personnelCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // برای ایندکس و جستجوی فوق‌العاده سریع
    },

    // تب ۱: اطلاعات فردی و هویتی
    personalInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      nationalCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      birthDate: { type: String }, // می‌تواند تاریخ شمسی یا میلادی ذخیره شود
      mobile: { type: String, required: true, trim: true },
      emergencyContact: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        relation: { type: String, default: "" }, // نسبت (مثلاً: همسر، پدر)
      },
      maritalStatus: {
        type: String,
        enum: ["single", "married"],
        default: "single",
      },
      childrenCount: { type: Number, default: 0 },
      homeAddress: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

    // تب ۲: اطلاعات شغلی و سازمانی
    jobContract: {
      department: { type: String, required: true, trim: true }, // دپارتمان / واحد (مثلاً تولید، فنی)
      jobTitle: { type: String, required: true, trim: true }, // عنوان شغلی
      workplaceLocation: { type: String, default: "" }, // آدرس محل کار یا نام کارگاه
      contractType: {
        type: String,
        enum: ["permanent", "temporary", "probation", "hourly"], // رسمی، قراردادی، آزمایشی، ساعتی
        default: "temporary",
      },
      hireDate: { type: Date, required: true }, // تاریخ شروع به کار (سابقه از این محاسبه می‌شود)
      contractEndDate: { type: Date },
      shiftType: { type: String, default: "morning" }, // شیفت کاری (صبح، عصر، شب، چرخشی)
      status: {
        type: String,
        enum: ["active", "inactive", "suspended", "terminated"], // فعال، غیرفعال، معلق، تسویه‌شده
        default: "active",
      },
    },

    // تب ۳: اطلاعات مالی و بیمه پایه
    financialProfile: {
      baseSalary30Days: { type: Number, required: true, default: 0 }, // حقوق پایه بر مبنای ۳۰ روز
      socialSecurityNumber: { type: String, default: "" }, // شماره بیمه تامین اجتماعی
      previousInsuranceMonths: { type: Number, default: 0 }, // سوابق بیمه قبلی به ماه
      shebaNumber: { type: String, default: "" }, // شماره شبا
      cardNumber: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      bankName: { type: String, default: "" },
    },
  },
  {
    timestamps: true, // خودکار فیلدهای createdAt و updatedAt را می‌سازد
  },
);

// ایندکس متنی برای سرچ روان روی نام و نام خانوادگی
personnelSchema.index({
  "personalInfo.firstName": "text",
  "personalInfo.lastName": "text",
});

const Personnel = mongoose.model("Personnel", personnelSchema);

export default Personnel;
