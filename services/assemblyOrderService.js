import { randomInt } from "node:crypto";
import { AssemblyOrder } from "../models/AssemblyOrder.js";

/**
 * Generate an order code such as "b77-401".
 * The first character is a lowercase English letter,
 * followed by two digits, a hyphen, and three digits.
 *
 * @returns {string} A candidate order code.
 */
export const generateOrderCode = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const letter = letters[randomInt(0, letters.length)];
  const firstNumber = randomInt(10, 100);
  const secondNumber = randomInt(100, 1000);

  return `${letter}${firstNumber}-${secondNumber}`;
};

/**
 * Create an assembly order, retrying if its generated code already exists.
 *
 * @param {object} orderData - Validated order details.
 * @returns {Promise<object>} The saved order document.
 */
export const createOrder = async (orderData) => {
  const { customer, product, targetQty, deadline } = orderData;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await AssemblyOrder.create({
        customer,
        product,
        targetQty,
        deadline,
        orderCode: generateOrderCode(),
      });
    } catch (error) {
      // Retry only if the generated order code collided.
      if (error.code !== 11000 || !error.keyPattern?.orderCode) {
        throw error;
      }
    }
  }

  throw new Error("Could not generate a unique order code.");
};

/**
 * Add a line-stoppage report to an assembly order.
 *
 * @param {string} orderId - MongoDB ID of the order.
 * @param {string} reason - Reason for the stoppage.
 * @returns {Promise<object>} The updated order document.
 */
// export const logStoppage = async (orderId, reason) => {
//   const updatedOrder = await AssemblyOrder.findByIdAndUpdate(
//     orderId,
//     {
//       $push: {
//         stoppageLogs: {
//           reason,
//           timestamp: new Date(),
//         },
//       },
//     },
//     { new: true, runValidators: true },
//   );

//   if (!updatedOrder) {
//     throw new Error("Order not found for logging stoppage.");
//   }

//   return updatedOrder;
// };
export const logStoppage = async (orderId, reason) => {
  const updatedOrder = await AssemblyOrder.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status: "stopped",
      },
      $push: {
        stoppageLogs: {
          reason,
          timestamp: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedOrder) {
    throw new Error("Order not found for logging stoppage.");
  }

  return updatedOrder;
};

/**
 * Finalize an order without resetting its completion time on repeated calls.
 *
 * @param {string} orderId - MongoDB ID of the order.
 * @returns {Promise<object>} The finalized order document.
 */
export const finalizeOrder = async (orderId) => {
  const updatedOrder = await AssemblyOrder.findOneAndUpdate(
    { _id: orderId, status: { $ne: "completed" } },
    {
      $set: {
        status: "completed",
        completedAt: new Date(),
      },
    },
    { new: true, runValidators: true },
  );

  if (updatedOrder) {
    return updatedOrder;
  }

  const existingOrder = await AssemblyOrder.findById(orderId);

  if (!existingOrder) {
    throw new Error("Order not found for finalization.");
  }

  return existingOrder; // Already finalized.
};

/**
 * Return all assembly orders, newest first.
 *
 * @returns {Promise<Array<object>>} The order documents.
 */
export const getAllOrders = async () => {
  return AssemblyOrder.find().sort({ createdAt: -1 });
};

/**
 * Delete an assembly order permanently by ID.
 *
 * @param {string} orderId - MongoDB ID of the order.
 * @returns {Promise<object>} The deleted order document.
 */
export const deleteOrder = async (orderId) => {
  const deletedOrder = await AssemblyOrder.findByIdAndDelete(orderId);

  if (!deletedOrder) {
    throw new Error("Order not found for deletion.");
  }

  return deletedOrder;
};
