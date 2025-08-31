import express from "express";
import type  {Request,Response} from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ service: "events", status: "running" });
});

// Example route for fetching events
app.get("/events", (req: Request, res: Response) => {
  res.json([
    { id: 1, title: "Hackathon 2025", date: "2025-09-15" },
    { id: 2, title: "AI Workshop", date: "2025-10-01" }
  ]);
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Events API running on port ${PORT}`));
