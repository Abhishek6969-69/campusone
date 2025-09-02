import { Response } from "express";
import { AuthRequest } from "../middleware/auth.ts";
import * as noteService from "../services/note.service.ts";

// ✅ Upload Note
export const uploadNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, fileUrl } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ error: "title and fileUrl are required" });
    }

    const note = await noteService.uploadNote({
      title,
      description,
      fileUrl,
      professorId: req.user!.id,
      collegeId: req.user!.collegeId,
    });

    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Notes
export const getAllNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await noteService.getAllNotes(req.user!.collegeId);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Note by ID
export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id, req.user!.collegeId);

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Notes by Professor
export const getNotesByProfessor = async (req: AuthRequest, res: Response) => {
  try {
    const { professorId } = req.params;
    const notes = await noteService.getNotesByProfessor(professorId, req.user!.collegeId);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await noteService.deleteNote(id, req.user!.collegeId);

    if (result.count === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
