import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import personnelRoutes from "./routes/personnelRoutes.js";
import fundingSourceRoutes from "./routes/fundingSourceRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import requiredMaterialRoutes from "./routes/requiredMaterialRoutes.js";
import inboundReceiptRoutes from "./routes/inboundReceiptRoutes.js";
import qcReportRoutes from "./routes/qcReportRoutes.js";
import assemblyOrderRoutes from "./routes/assemblyOrderRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

//  funding api
app.use("/api/funding-sources", fundingSourceRoutes);

// personal api
app.use("/api/personnel", personnelRoutes);
// purchase-orders api
app.use("/api/purchase-orders", purchaseOrderRoutes);
// required-materials
app.use("/api/required-materials", requiredMaterialRoutes);
// data base response
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "OpsCore Backend is running!" });
});
// Warehouse Inbound Materials
app.use("/api/inbound", inboundReceiptRoutes);

// exports
app.use("/api/assembly-orders", assemblyOrderRoutes);

// qc exports report
app.use("/api/qc-reports", qcReportRoutes);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
