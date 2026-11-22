import * as purchaseOrderService from "../services/purchaseOrderService.js";
import { createPurchaseOrderSchema } from "../validations/purchaseOrderValidation.js";

/**
 * POST /api/purchase-orders
 * Place order from Tab 1 (Required Materials) into Tab 2 (Purchase Orders)
 */
export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { error, value } = createPurchaseOrderSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await purchaseOrderService.createPurchaseOrder(value);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * GET /api/purchase-orders
 * Fetch order list and aggregated summary for Tab 2
 */
export const getPurchaseOrders = async (req, res, next) => {
  try {
    const result = await purchaseOrderService.getAllPurchaseOrders(req.query);

    return res.status(200).json({
      success: true,
      data: result.orders,
      // 👇 دقیقا همینجا بخش summary قرار می‌گیرد
      summary: {
        totalOrders: result.total,
        totalOrderedAmount: result.totalOrderedAmount,
        unpricedOrders: result.unpricedOrders,
        totalBlockedAmount: result.totalBlockedAmount,
      },
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/purchase-orders/:id
 * Fetch single order details
 */
export const getPurchaseOrderById = async (req, res, next) => {
  try {
    const order = await purchaseOrderService.getPurchaseOrderById(
      req.params.id,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Purchase order '${req.params.id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
