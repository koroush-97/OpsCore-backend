// controllers/personnelController.js
import Personnel from "../models/Personnel.js";

// ۱. ثبت پرسنل جدید
export const createPersonnel = async (req, res) => {
  try {
    const { personnelCode, personalInfo, jobContract, financialProfile } =
      req.body;

    // بررسی تکراری نبودن کد پرسنلی و کد ملی
    const existingCode = await Personnel.findOne({ personnelCode });
    if (existingCode) {
      return res.status(400).json({ message: "کد پرسنلی تکراری است." });
    }

    const existingNational = await Personnel.findOne({
      "personalInfo.nationalCode": personalInfo?.nationalCode,
    });
    if (existingNational) {
      return res.status(400).json({ message: "کد ملی قبلاً ثبت شده است." });
    }

    const newPersonnel = new Personnel({
      personnelCode,
      personalInfo,
      jobContract,
      financialProfile,
    });

    await newPersonnel.save();

    res.status(201).json({
      message: "پرسنل با موفقیت ثبت شد.",
      personnel: newPersonnel,
    });
  } catch (error) {
    console.error("Error creating personnel:", error);
    res.status(500).json({ message: "خطا در ثبت پرسنل", error: error.message });
  }
};

// ۲. سرچ سریع (برای باکس جستجوی بالای صفحه)
export const searchPersonnel = async (req, res) => {
  try {
    const { q } = req.query; // رشته جستجو (مثلاً: "104" یا "علی")
    if (!q || q.trim() === "") {
      return res.status(200).json([]);
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const results = await Personnel.find({
      $or: [
        { personnelCode: searchRegex },
        { "personalInfo.nationalCode": searchRegex },
        { "personalInfo.firstName": searchRegex },
        { "personalInfo.lastName": searchRegex },
      ],
    })
      .select(
        "personnelCode personalInfo.firstName personalInfo.lastName jobContract.jobTitle jobContract.department",
      )
      .limit(10); // خروجی سبک فقط برای ساجست سرچ‌بار

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching personnel:", error);
    res
      .status(500)
      .json({ message: "خطا در جستجوی پرسنل", error: error.message });
  }
};

// ۳. دریافت پرونده کامل با کد پرسنلی (برای پر کردن هر ۴ تب)
export const getPersonnelByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const personnel = await Personnel.findOne({ personnelCode: code });
    if (!personnel) {
      return res.status(404).json({ message: "پرسنلی با این کد یافت نشد." });
    }

    res.status(200).json(personnel);
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res
      .status(500)
      .json({ message: "خطا در دریافت اطلاعات پرسنل", error: error.message });
  }
};

// ۴. دریافت لیست کل پرسنل
export const getAllPersonnel = async (req, res) => {
  try {
    const list = await Personnel.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching personnel list:", error);
    res
      .status(500)
      .json({ message: "خطا در دریافت لیست پرسنل", error: error.message });
  }
};
