import mongoose from "mongoose";
import PurchaseOrder from "../models/PurchaseOrder.js";
import RequiredMaterial from "../models/RequiredMaterial.js";

const createBusinessError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generatePurchaseOrderId = () => {
  const yearMonth = new Date().toISOString().slice(2, 7).replace("-", "");
  const uniquePart = new mongoose.Types.ObjectId().toString().toUpperCase();

  return `PO-${yearMonth}-${uniquePart}`;
};

export const createPurchaseOrder = async (orderData) => {
  const { requirementId, quantity } = orderData;

  // 1. If linked to a requirement, ensure it exists and is OPEN
  let requirement = null;
  if (requirementId) {
    requirement = await RequiredMaterial.findOne({
      id: requirementId,
      status: "OPEN",
    });

    if (!requirement) {
      const error = new Error(
        `Requirement '${requirementId}' not found or has already been ordered.`,
      );
      error.statusCode = 400;
      throw error;
    }
  }

  // 2. Generate unique PO Number
  const newOrderId = await generatePurchaseOrderId();

  // Calculate pricing (ensure safe positive integer for Rial)
  const rawUnitPrice = Number(
    orderData.unitPrice ||
      orderData.estimatedUnitPrice ||
      (requirement ? requirement.estimatedUnitPrice : 0) ||
      0,
  );
  const unitPrice = Math.round(rawUnitPrice);

  const orderQty = Number(
    quantity || (requirement ? requirement.suggestedAmount : 1),
  );
  const totalAmount = Math.round(unitPrice * orderQty);

  // 3. Create Purchase Order document matching Mongoose Schema exactly
  const order = new PurchaseOrder({
    id: newOrderId,
    requirementId: requirementId || null,
    materialId: orderData.materialId || requirement?.materialId,
    name: orderData.name || requirement?.name,
    sku: orderData.sku || requirement?.sku,
    type: orderData.type || requirement?.type || "RAW_MATERIAL",
    quantity: orderQty,
    unit: orderData.unit || requirement?.unit,
    unitPrice: unitPrice, // 👈 تغییر یافت (قبلاً estimatedUnitPrice بود)
    totalAmount: totalAmount, // 👈 تغییر یافت (قبلاً totalEstimatedPrice بود)
    warehouseId: orderData.warehouseId || requirement?.warehouseId || "WH-01",
    warehouseName:
      orderData.warehouseName || requirement?.warehouseName || "انبار مرکزی",
    supplierName: orderData.supplierName || "نامشخص / در حال استعلام",
    fundingSourceId: orderData.fundingSourceId || null,
    status: "ORDERED",
    financialStatus: "RESERVED", // 👈 تغییر یافت (قبلاً PENDING_FUNDING بود که خارج از enum بود)
  });

  const savedOrder = await order.save();

  // 4. Update the requirement status to ORDERED
  if (requirement) {
    requirement.status = "ORDERED";
    requirement.purchaseOrderId = newOrderId;
    await requirement.save();
  }

  return savedOrder;
};

/**
 * List orders and calculate totals across the full filtered result.
 */
export const getAllPurchaseOrders = async (query = {}) => {
  const requestedPage = Number(query.page ?? 1);
  const requestedLimit = Number(query.limit ?? 50);

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const limit =
    Number.isSafeInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 50;

  const filter = {};

  if (typeof query.status === "string" && query.status.trim()) {
    filter.status = query.status.trim();
  }

  const [orders, summaryRows] = await Promise.all([
    PurchaseOrder.find(filter)
      .sort({ orderDate: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    PurchaseOrder.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          knownAmount: {
            $sum: {
              $cond: [{ $isNumber: "$totalAmount" }, "$totalAmount", 0],
            },
          },
          pricedOrders: {
            $sum: {
              $cond: [{ $isNumber: "$totalAmount" }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const summary = summaryRows[0];
  const total = summary?.total ?? 0;
  const pricedOrders = summary?.pricedOrders ?? 0;

  return {
    orders,
    total,
    page,
    limit,
    // Do not present a partial sum as the total for all orders.
    totalOrderedAmount:
      pricedOrders === total ? (summary?.knownAmount ?? 0) : null,
    unpricedOrders: total - pricedOrders,
    // No money is actually blocked in the current implementation.
    totalBlockedAmount: null,
  };
};

/**
 * Get an order by its business ID.
 */
export const getPurchaseOrderById = async (id) => {
  return PurchaseOrder.findOne({ id }).lean();
};
