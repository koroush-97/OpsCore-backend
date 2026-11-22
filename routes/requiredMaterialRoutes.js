import express from "express";
import {
  getRequiredMaterials,
  createRequiredMaterial,
  updateRequiredMaterial,
  deleteRequiredMaterial,
} from "../controllers/requiredMaterialController.js";

const router = express.Router();

router.get("/", getRequiredMaterials);
router.post("/", createRequiredMaterial);
router.put("/:id", updateRequiredMaterial);
router.delete("/:id", deleteRequiredMaterial);

export default router;
