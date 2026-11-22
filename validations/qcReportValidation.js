import Joi from "joi";

export const createQcReportSchema = Joi.object({
  inspectorName: Joi.string().trim().required().messages({
    "string.empty": "نام بازرس نمی‌تواند خالی باشد",
    "any.required": "نام بازرس الزامی است",
  }),
  inspectionDate: Joi.string().trim().required().messages({
    "string.empty": "تاریخ بازرسی الزامی است",
    "any.required": "تاریخ بازرسی الزامی است",
  }),
  testedToday: Joi.number().min(0).required().messages({
    "number.base": "تعداد تست‌شده باید عدد باشد",
    "any.required": "تعداد تست‌شده الزامی است",
  }),
  standardPassed: Joi.number().min(0).required().messages({
    "number.base": "تعداد استاندارد باید عدد باشد",
    "any.required": "تعداد استاندارد الزامی است",
  }),
  reworkRequired: Joi.number().min(0).required().messages({
    "number.base": "تعداد نیازمند اصلاح باید عدد باشد",
    "any.required": "تعداد نیازمند اصلاح الزامی است",
  }),
  scrapped: Joi.number().min(0).required().messages({
    "number.base": "تعداد ضایعات باید عدد باشد",
    "any.required": "تعداد ضایعات الزامی است",
  }),
  passRate: Joi.number().min(0).max(100).optional(),

  shiftNote: Joi.string().trim().required().messages({
    "string.empty": "یادداشت شیفت نمی‌تواند خالی باشد",
    "any.required": "یادداشت شیفت الزامی است",
  }),
});
