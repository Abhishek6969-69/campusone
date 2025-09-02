import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  rsvpToEvent,
} from "../controllers/event.controller.ts";
import { authMiddleware, requireRole } from "../middleware/auth.ts";

const router = Router();

// ✅ All event routes require authentication
router.use(authMiddleware);

// Professors/Admins can create events
router.post("/", requireRole(["PROFESSOR", "ADMIN"]), createEvent);

// Everyone can list/get events in their college
router.get("/", getEvents);
router.get("/:id", getEventById);

// Only Students can RSVP
router.post("/:id/rsvp", requireRole(["STUDENT"]), rsvpToEvent);

export default router;
