import RequiredMaterial from "../models/RequiredMaterial.js";

/**
 * Generate unique business ID for RequiredMaterial (e.g., REQ-001)
 */
const generateRequirementId = async () => {
  const count = await RequiredMaterial.countDocuments();
  return `REQ-${String(count + 1).padStart(3, "0")}`;
};

/**
 * Get all required materials (by default only OPEN ones for Tab 1)
 */
export const getRequiredMaterials = async (query = {}) => {
  const { status = "OPEN", urgency, warehouseId } = query;
  const filter = {};

  if (status !== "ALL") {
    filter.status = status;
  }
  if (urgency) filter.urgency = urgency;
  if (warehouseId) filter.warehouseId = warehouseId;

  return await RequiredMaterial.find(filter).sort({ createdAt: -1 }).lean();
};

/**
 * Create a new material requirement manually
 */
export const createRequiredMaterial = async (data) => {
  const requirementId = await generateRequirementId();
  const newRequirement = new RequiredMaterial({
    ...data,
    id: requirementId,
    status: "OPEN",
    purchaseOrderId: null,
  });

  return await newRequirement.save();
};

/**
 * Update an existing requirement (only allowed if still OPEN)
 */
// export const updateRequiredMaterial = async (id, updateData) => {
//   const requirement = await RequiredMaterial.findById({ id });

//   if (!requirement) {
//     throw new Error(`Requirement with ID '${id}' not found.`);
//   }

//   if (requirement.status === "ORDERED") {
//     throw new Error("Cannot edit a requirement that has already been ordered.");
//   }

//   Object.assign(requirement, updateData);
//   return await requirement.save();
// };

export const updateRequiredMaterial = async (id, updateData) => {
  const requirement = await RequiredMaterial.findById(id);

  if (!requirement) {
    throw new Error(`Requirement with ID '${id}' not found.`);
  }

  if (requirement.status === "ORDERED") {
    throw new Error("Cannot edit a requirement that has already been ordered.");
  }

  Object.assign(requirement, updateData);
  return await requirement.save();
};

/**
 * Delete a requirement (only allowed if OPEN)
 */
export const deleteRequiredMaterial = async (id) => {
  const requirement = await RequiredMaterial.findOne({ id });

  if (!requirement) {
    throw new Error(`Requirement with ID '${id}' not found.`);
  }

  if (requirement.status === "ORDERED") {
    throw new Error(
      "Cannot delete a requirement that has already been ordered.",
    );
  }

  await RequiredMaterial.deleteOne({ id });
  return true;
};
