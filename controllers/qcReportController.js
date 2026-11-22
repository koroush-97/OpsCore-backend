import { createQcReportSchema } from "../validations/qcReportValidation.js";
import {
  createReport,
  getLatestReport,
  getAllReports,
} from "../services/qcReportService.js";

export const createQcReport = async (req, res) => {
  const { error, value } = createQcReportSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "اطلاعات گزارش QC معتبر نیست",
      errors: error.details.map((detail) => detail.message),
    });
  }

  const report = await createReport(value);

  return res.status(201).json({
    success: true,
    data: report,
  });
};

export const getLatestQcReport = async (req, res) => {
  const report = await getLatestReport();

  return res.status(200).json({
    success: true,
    data: report, // اگر هنوز گزارشی ثبت نشده باشد، null است.
  });
};

export const getAllQcReports = async (req, res) => {
  const limit = Number(req.query.limit ?? 10);

  if (!Number.isSafeInteger(limit) || limit < 1) {
    return res.status(400).json({
      success: false,
      message: "limit باید یک عدد صحیح مثبت باشد",
    });
  }

  const reports = await getAllReports(limit);

  return res.status(200).json({
    success: true,
    data: reports,
  });
};
