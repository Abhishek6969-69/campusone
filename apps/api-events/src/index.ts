import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./routes/event.routes.ts";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ not '*'
    credentials: true,               // ✅ allow cookies/auth headers
  })
);
app.use(express.json());

// Routes
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`✅ Event API running on port ${PORT}`);
});
