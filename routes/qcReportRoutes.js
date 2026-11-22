import { Router } from "express";
import {
  createQcReport,
  getLatestQcReport,
  getAllQcReports,
} from "../controllers/qcReportController.js";

const router = Router();

router.post("/", createQcReport);
router.get("/latest", getLatestQcReport);
router.get("/", getAllQcReports);

export default router;
