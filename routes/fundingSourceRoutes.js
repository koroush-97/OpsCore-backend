// export default router;
import express from "express";
import {
  getFundingSources,
  getFundingSourcesSummary,
  getFundingSourceById,
  deductBalance, // <--- اضافه کردن این
  addBalance, // <--- اضافه کردن این
  transferFunds,
} from "../controllers/fundingSourceController.js";

const router = express.Router();

// Summary route must come before :id to prevent matching 'summary' as an id
router.get("/summary", getFundingSourcesSummary);
router.get("/", getFundingSources);
router.get("/:id", getFundingSourceById);

// New transactional routes for manual or direct balance updates
router.post("/:id/deduct", deductBalance);
router.post("/:id/add", addBalance);

router.post("/transfer", transferFunds);

export default router;
