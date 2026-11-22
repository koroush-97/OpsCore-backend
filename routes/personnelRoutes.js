import express from "express";
import {
  createPersonnel,
  searchPersonnel,
  getPersonnelByCode,
  getAllPersonnel,
} from "../controllers/personnelController.js";

const router = express.Router();
router.post("/", createPersonnel);
router.get("/search", searchPersonnel);
router.get("/", getAllPersonnel);
router.get("/:code", getPersonnelByCode);

export default router;
