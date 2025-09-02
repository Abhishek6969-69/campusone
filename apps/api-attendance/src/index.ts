import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.routes.ts";

dotenv.config(); // load environment variables

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ not '*'
    credentials: true,               // ✅ allow cookies/auth headers
  })
);// allow frontend (Next.js) to call API
app.use(express.json()); // parse JSON request bodies

// Register routes
app.use("/attendance", attendanceRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`✅ Attendance API running on port ${PORT}`);
});
