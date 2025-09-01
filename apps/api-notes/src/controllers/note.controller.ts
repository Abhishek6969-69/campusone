import { Request, Response } from "express";
import * as noteService from "../services/note.service.ts";

// ✅ Upload Note
export const uploadNote = async (req: Request, res: Response) => {
  try {
    const { title, description, fileUrl, professorId } = req.body;

    if (!title || !fileUrl || !professorId) {
      return res.status(400).json({ error: "title, fileUrl, and professorId are required" });
    }

    const note = await noteService.uploadNote({ title, description, fileUrl, professorId });
    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Notes
export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id);

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Notes by Professor
export const getNotesByProfessor = async (req: Request, res: Response) => {
  try {
    const { professorId } = req.params;
    const notes = await noteService.getNotesByProfessor(professorId);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await noteService.deleteNote(id);
    res.json({ message: "Note deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
