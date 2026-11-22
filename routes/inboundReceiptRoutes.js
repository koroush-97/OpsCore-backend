import express from "express";
import {
  receivePurchaseOrder,
  getInboundList,
} from "../controllers/InboundReceiptController.js";

const router = express.Router();

// ثبت بار ورودی از سفارش خرید
router.post("/receive", receivePurchaseOrder);

// دریافت لیست کل اقلام ورودی انبار
router.get("/", getInboundList);

export default router;
