import prisma from "@campusone/db";

type NoteInput = {
  title: string;
  description?: string;
  fileUrl: string;
  professorId: string;
};

// ✅ Upload Note
export const uploadNote = async (data: NoteInput) => {
  return await prisma.note.create({
    data: {
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      uploadedBy: data.professorId,
    },
  });
};

// ✅ Get All Notes
export const getAllNotes = async () => {
  return await prisma.note.findMany({
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
};

// ✅ Get Note by ID
export const getNoteById = async (id: string) => {
  return await prisma.note.findUnique({
    where: { id },
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

// ✅ Get Notes by Professor
export const getNotesByProfessor = async (professorId: string) => {
  return await prisma.note.findMany({
    where: { uploadedBy: professorId },
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
};

// ✅ Delete Note
export const deleteNote = async (id: string) => {
  return await prisma.note.delete({
    where: { id },
  });
};
