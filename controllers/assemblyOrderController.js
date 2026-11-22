import { createOrderSchema } from "../validations/assemblyOrderVladition.js";
import {
  createOrder,
  getAllOrders,
  logStoppage,
  finalizeOrder,
  deleteOrder,
} from "../services/assemblyOrderService.js";

const isValidOrderId = (id) =>
  typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

/**
 * Validate the request and create a new assembly order.
 */
export const createAssemblyOrder = async (req, res) => {
  const { error, value } = createOrderSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "اطلاعات سفارش معتبر نیست.",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  const order = await createOrder(value);

  return res.status(201).json({
    success: true,
    data: order,
  });
};

/**
 * Return all assembly orders, newest first.
 */
export const getAssemblyOrders = async (req, res) => {
  const orders = await getAllOrders();

  return res.status(200).json({
    success: true,
    data: orders,
  });
};

/**
 * Add a line-stoppage report to an assembly order.
 */
export const reportAssemblyStoppage = async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body ?? {};

  if (!isValidOrderId(orderId)) {
    return res.status(400).json({
      success: false,
      message: "شناسه سفارش معتبر نیست.",
    });
  }

  if (typeof reason !== "string" || !reason.trim()) {
    return res.status(400).json({
      success: false,
      message: "دلیل توقف الزامی است.",
    });
  }

  try {
    const order = await logStoppage(orderId, reason.trim());

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error.message === "Order not found for logging stoppage.") {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد.",
      });
    }

    throw error;
  }
};

/**
 * Finalize an assembly order and return its final state.
 */
export const finalizeAssemblyOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!isValidOrderId(orderId)) {
    return res.status(400).json({
      success: false,
      message: "شناسه سفارش معتبر نیست.",
    });
  }

  try {
    const order = await finalizeOrder(orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error.message === "Order not found for finalization.") {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد.",
      });
    }

    throw error;
  }
};

/**
 * Delete an assembly order permanently.
 */
export const deleteAssemblyOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!isValidOrderId(orderId)) {
    return res.status(400).json({
      success: false,
      message: "شناسه سفارش معتبر نیست.",
    });
  }

  try {
    await deleteOrder(orderId);

    return res.status(200).json({
      success: true,
      message: "سفارش با موفقیت حذف شد.",
    });
  } catch (error) {
    if (error.message === "Order not found for deletion.") {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد.",
      });
    }

    throw error;
  }
};
