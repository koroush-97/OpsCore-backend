import * as fundingSourceService from "../services/fundingSourceService.js";

/**
 * GET /api/funding-sources
 * Returns active funding sources list (for selects/tables)
 */
export const getFundingSources = async (req, res, next) => {
  try {
    const sources = await fundingSourceService.getAllActiveFundingSources();
    res.status(200).json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/funding-sources/summary
 * Returns aggregated stats for dashboard metrics
 */
export const getFundingSourcesSummary = async (req, res, next) => {
  try {
    const summary = await fundingSourceService.getFundingSourcesSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/funding-sources/:id
 * Returns a specific funding source by business ID
 */
export const getFundingSourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const source = await fundingSourceService.getFundingSourceById(id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: `Funding source with ID '${id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/funding-sources/:id/deduct
 * Deduct amount from a funding source
 */
export const deductBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const updatedSource = await fundingSourceService.deductFundingSourceBalance(
      id,
      amount,
    );

    res.status(200).json({
      success: true,
      message: "Balance deducted successfully.",
      data: updatedSource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/funding-sources/:id/add
 * Add amount to a funding source
 */
export const addBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const updatedSource = await fundingSourceService.addFundingSourceBalance(
      id,
      amount,
    );

    res.status(200).json({
      success: true,
      message: "Balance added successfully.",
      data: updatedSource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/funding-sources/transfer
 * Transfer funds between two accounts
 */
export const transferFunds = async (req, res, next) => {
  try {
    const { fromSourceId, toSourceId, amount } = req.body;

    if (!fromSourceId || !toSourceId || !amount) {
      return res.status(400).json({
        success: false,
        message: "fromSourceId, toSourceId, and amount are required.",
      });
    }

    const result = await fundingSourceService.transferFunds(
      fromSourceId,
      toSourceId,
      amount,
    );

    res.status(200).json({
      success: true,
      message: "Transfer completed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
