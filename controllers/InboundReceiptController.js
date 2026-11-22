import * as inboundService from "../services/InboundReceiptService.js";

import { createInboundReceiptSchema } from "../validations/inboundReceiptValidation.js";

export const receivePurchaseOrder = async (req, res) => {
  try {
    const { error, value } = createInboundReceiptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const receipt = await inboundService.createInboundFromOrder(value);

    return res.status(201).json({
      success: true,
      message: "قلم ورودی با موفقیت در انبار ثبت گردید.",
      data: receipt,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "خطای سرور در ثبت ورود کالا به انبار",
    });
  }
};

export const getInboundList = async (req, res) => {
  try {
    const list = await inboundService.getAllInboundReceipts();

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "خطای سرور در دریافت لیست اقلام ورودی",
    });
  }
};
