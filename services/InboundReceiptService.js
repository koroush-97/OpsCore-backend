// import { InboundReceipt } from "../models/InboundReceipt.js";

// export const createInboundFromOrder = async (orderData) => {
//   const newReceipt = new InboundReceipt({
//     purchaseOrderId: orderData.id,
//     materialId: orderData.materialId,
//     name: orderData.name,
//     sku: orderData.sku,
//     type: orderData.type || "RAW_MATERIAL",
//     unit: orderData.unit,
//     warehouse: orderData.warehouseName || "انبار اصلی",
//     // تعداد کالای سفارش‌داده شده مستقیماً به عنوان موجودی اولیه ورودی می‌نشیند
//     rawAvailable: Number(orderData.quantity) || 0,
//     inProduction: 0,
//     readyForExport: 0,
//     defectiveAmount: 0,
//   });

//   return await newReceipt.save();
// };
import { InboundReceipt } from "../models/InboundReceipt.js";
import PurchaseOrder from "../models/PurchaseOrder.js"; // ۱. مدل سفارش خرید را ایمپورت کن

export const createInboundFromOrder = async (orderData) => {
  // ۲. ابتدا رسید انبار را ثبت کن
  const newReceipt = new InboundReceipt({
    purchaseOrderId: orderData.id,
    materialId: orderData.materialId,
    name: orderData.name,
    sku: orderData.sku,
    type: orderData.type || "RAW_MATERIAL",
    unit: orderData.unit,
    warehouse: orderData.warehouseName || "انبار اصلی",
    rawAvailable: Number(orderData.quantity) || 0,
    inProduction: 0,
    readyForExport: 0,
    defectiveAmount: 0,
  });

  const savedReceipt = await newReceipt.save();

  // ۳. حالا سفارش خرید را حذف کن (چون دیگر "در راه" نیست و وارد انبار شده)
  // فرض بر این است که orderData.id همان شماره سفارش (مثلا PO-...) است
  if (orderData.id) {
    await PurchaseOrder.findOneAndDelete({ id: orderData.id });
  }

  return savedReceipt;
};

export const getAllInboundReceipts = async () => {
  return await InboundReceipt.find().sort({ createdAt: -1 });
};
