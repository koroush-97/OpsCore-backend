import "dotenv/config";
import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  const result = await mongoose.connection.db.admin().command({ hello: 1 });

  console.log("Replica Set:", result.setName ?? "Not configured");
  console.log("Primary:", result.isWritablePrimary);
} catch (error) {
  console.error("MongoDB check failed:", error.message);
} finally {
  await mongoose.disconnect();
}
