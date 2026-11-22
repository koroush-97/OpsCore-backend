// import { Router } from "express";
// import {
//   createAssemblyOrder,
//   getAssemblyOrders,
//   reportAssemblyStoppage,
//   finalizeAssemblyOrder,
//   deleteAssemblyOrder,
// } from "../controllers/assemblyOrderController.js";

// const router = Router();

// // ۱. روت‌های مربوط به مجموعه سفارش‌ها
// router.route("/").get(getAssemblyOrders).post(createAssemblyOrder);

// // ۲. روت‌های مربوط به عملیات روی یک سفارش خاص
// router.post("/:orderId/stoppage", reportAssemblyStoppage);
// router.patch("/:orderId/finalize", finalizeAssemblyOrder);

// // مسیر حذف:
// router.delete("/assembly-orders/:orderId", deleteAssemblyOrder);
// export default router;
import { Router } from "express";
import {
  createAssemblyOrder,
  getAssemblyOrders,
  reportAssemblyStoppage,
  finalizeAssemblyOrder,
  deleteAssemblyOrder,
} from "../controllers/assemblyOrderController.js";

const router = Router();

// ۱. روت‌های مربوط به مجموعه سفارش‌ها
router.route("/").get(getAssemblyOrders).post(createAssemblyOrder);

// ۲. روت‌های مربوط به عملیات روی یک سفارش خاص
router.post("/:orderId/stoppage", reportAssemblyStoppage);
router.patch("/:orderId/finalize", finalizeAssemblyOrder);

// ۳. روت حذف سفارش:
router.delete("/:orderId", deleteAssemblyOrder);

export default router;
