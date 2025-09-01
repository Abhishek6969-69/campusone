import express from "express";
import cors from "cors";
import noteRoutes from "./routes/note.routes.ts";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/notes", noteRoutes);

// Server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Notes API running on http://localhost:${PORT}`);
});
