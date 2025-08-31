import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ service: "notes", status: "running" });
});

// Example route for fetching notes
app.get("/notes", (req: Request, res: Response) => {
  res.json([
    { id: 1, title: "Intro to DBMS", uploadedBy: "Prof. Sharma" },
    { id: 2, title: "Operating Systems Notes", uploadedBy: "Prof. Mehta" }
  ]);
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Notes API running on port ${PORT}`));
