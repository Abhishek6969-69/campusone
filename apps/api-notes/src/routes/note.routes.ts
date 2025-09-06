import { Router } from "express";
import {
  uploadNote,
  getAllNotes,
  getNoteById,
  getNotesByProfessor,
  deleteNote,
} from "../controllers/note.controller.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

// ✅ All note routes require authentication
router.use(authMiddleware);

// Professor uploads note
router.post("/upload", uploadNote);

// Get all notes for logged-in user’s college
router.get("/", getAllNotes);

// Get single note by ID
router.get("/:id", getNoteById);

// Get notes by professor
router.get("/professor/:professorId", getNotesByProfessor);

// Delete a note
router.delete("/:id", deleteNote);

export default router;
