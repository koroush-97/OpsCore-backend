import * as requiredMaterialService from "../services/requiredMaterialService.js";
import {
  createRequiredMaterialSchema,
  updateRequiredMaterialSchema,
} from "../validations/requiredMaterialValidation.js";

/**
 * GET /api/required-materials
 * List materials (defaults to status=OPEN for Tab 1)
 */
export const getRequiredMaterials = async (req, res, next) => {
  try {
    const materials = await requiredMaterialService.getRequiredMaterials(
      req.query,
    );
    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/required-materials
 * Add a new critical requirement
 */
export const createRequiredMaterial = async (req, res, next) => {
  try {
    const { error, value } = createRequiredMaterialSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((d) => d.message),
      });
    }

    const newMaterial =
      await requiredMaterialService.createRequiredMaterial(value);
    res.status(201).json({
      success: true,
      message: "Required material created successfully",
      data: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/required-materials/:id
 * Edit requirement details
 */
export const updateRequiredMaterial = async (req, res, next) => {
  try {
    const { error, value } = updateRequiredMaterialSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((d) => d.message),
      });
    }

    const updated = await requiredMaterialService.updateRequiredMaterial(
      req.params.id,
      value,
    );

    res.status(200).json({
      success: true,
      message: "Required material updated successfully",
      data: updated,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Cannot edit")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/required-materials/:id
 * Delete requirement
 */
export const deleteRequiredMaterial = async (req, res, next) => {
  try {
    await requiredMaterialService.deleteRequiredMaterial(req.params.id);
    res.status(200).json({
      success: true,
      message: "Required material deleted successfully",
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Cannot delete")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
