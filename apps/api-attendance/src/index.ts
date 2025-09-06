import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.routes";
import classRoutes from "./routes/classes.routes";

dotenv.config(); // load environment variables

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add both ports
    credentials: true,                // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"],     // Allow these headers
  })
);
app.use(express.json()); // parse JSON request bodies

// Register routes
app.use("/attendance", attendanceRoutes);
app.use("/classes", classRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`✅ Attendance API running on port ${PORT}`);
});
