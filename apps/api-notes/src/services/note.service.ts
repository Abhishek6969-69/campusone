import {prisma} from "@campusone/db";
type NoteInput = {
  title: string;
  description?: string;
  fileUrl: string;
  professorId: string;
  collegeId: string;
};

// ✅ Upload Note (college scoped)
export const uploadNote = async (data: NoteInput) => {
  return await prisma.note.create({
    data: {
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      uploadedBy: data.professorId,
      collegeId: data.collegeId,
    },
    include: {
      professor: { select: { id: true, name: true, email: true } },
    },
  });
};

// ✅ Get All Notes (for user’s college)
export const getAllNotes = async (collegeId: string) => {
  return await prisma.note.findMany({
    where: { collegeId },
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
};

// ✅ Get Note by ID (college scoped)
export const getNoteById = async (id: string, collegeId: string) => {
  return await prisma.note.findFirst({
    where: { id, collegeId },
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

// ✅ Get Notes by Professor (college scoped)
export const getNotesByProfessor = async (professorId: string, collegeId: string) => {
  return await prisma.note.findMany({
    where: { uploadedBy: professorId, collegeId },
    include: {
      professor: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
};

// ✅ Delete Note (only same-college professors/admins can delete)
export const deleteNote = async (id: string, collegeId: string) => {
  return await prisma.note.deleteMany({
    where: { id, collegeId }, // ✅ ensures no cross-college delete
  });
};
