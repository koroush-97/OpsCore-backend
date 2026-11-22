import FundingSource from "../models/FundingSource.js";

/**
 * Get all active funding sources for dropdowns and listings
 */
export const getAllActiveFundingSources = async () => {
  return await FundingSource.find({ isActive: true }).sort({ id: 1 }).lean();
};

/**
 * Get single funding source by business id (e.g., FS-01)
 */
export const getFundingSourceById = async (id) => {
  return await FundingSource.findOne({ id, isActive: true }).lean();
};

/**
 * Calculate dashboard summary metrics for funding sources
 */
export const getFundingSourcesSummary = async () => {
  const sources = await FundingSource.find({ isActive: true }).lean();

  const totalAvailable = sources.reduce(
    (acc, curr) => acc + (curr.balance || 0),
    0,
  );

  const totalCeiling = sources.reduce((acc, curr) => {
    return curr.ceilingAmount != null ? acc + curr.ceilingAmount : acc;
  }, 0);

  return {
    totalAvailable,
    totalCeiling: totalCeiling > 0 ? totalCeiling : null,
    accountsCount: sources.length,
    accounts: sources,
  };
};

/**
 * Deduct amount from a funding source (Used when a purchase order is funded)
 */
export const deductFundingSourceBalance = async (
  fundingSourceId,
  amount,
  session = null,
) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    const error = new Error("Invalid deduction amount.");
    error.statusCode = 400;
    throw error;
  }

  const query = FundingSource.findOne({ id: fundingSourceId, isActive: true });
  if (session) query.session(session);

  const source = await query;
  if (!source) {
    const error = new Error(
      `Funding source '${fundingSourceId}' not found or inactive.`,
    );
    error.statusCode = 404;
    throw error;
  }

  if (source.balance < numericAmount) {
    const error = new Error(
      `Insufficient balance in funding source '${source.name}'. Available: ${source.balance}, Required: ${numericAmount}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const updateQuery = FundingSource.findOneAndUpdate(
    { id: fundingSourceId },
    { $inc: { balance: -numericAmount } },
    { new: true },
  );
  if (session) updateQuery.session(session);

  return await updateQuery;
};

/**
 * Add amount to a funding source (Used when sales/income or refunds occur)
 */
export const addFundingSourceBalance = async (
  fundingSourceId,
  amount,
  session = null,
) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    const error = new Error("Invalid addition amount.");
    error.statusCode = 400;
    throw error;
  }

  const query = FundingSource.findOne({ id: fundingSourceId, isActive: true });
  if (session) query.session(session);

  const source = await query;
  if (!source) {
    const error = new Error(
      `Funding source '${fundingSourceId}' not found or inactive.`,
    );
    error.statusCode = 404;
    throw error;
  }

  const updateQuery = FundingSource.findOneAndUpdate(
    { id: fundingSourceId },
    { $inc: { balance: +numericAmount } },
    { new: true },
  );
  if (session) updateQuery.session(session);

  return await updateQuery;
};
/**
 * Transfer funds between two funding sources (e.g., from FS-01 to FS-03)
 */
export const transferFunds = async (fromSourceId, toSourceId, amount) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    const error = new Error("Invalid transfer amount.");
    error.statusCode = 400;
    throw error;
  }

  if (fromSourceId === toSourceId) {
    const error = new Error(
      "Source and destination accounts cannot be the same.",
    );
    error.statusCode = 400;
    throw error;
  }

  // 1. Deduct from origin account (checks balance automatically)
  const sourceAccount = await deductFundingSourceBalance(
    fromSourceId,
    numericAmount,
  );

  // 2. Add to destination account
  const destinationAccount = await addFundingSourceBalance(
    toSourceId,
    numericAmount,
  );

  return {
    sourceAccount,
    destinationAccount,
    transferredAmount: numericAmount,
  };
};
