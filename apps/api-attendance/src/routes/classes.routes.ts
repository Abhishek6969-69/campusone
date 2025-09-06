import { Router } from "express";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";
import { prisma } from "@campusone/db";

const router = Router();

// ✅ All routes require authentication
router.use(authMiddleware);

// Get classes where a professor is teaching
router.get("/teaching", requireRole(["PROFESSOR", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: {
        professorId: req.user!.id,
        collegeId: req.user!.collegeId,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    res.json(classes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get classes where a student is enrolled
router.get("/enrolled", requireRole(["STUDENT"]), async (req: AuthRequest, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: {
        attendance: {
          some: {
            studentId: req.user!.id,
          },
        },
        collegeId: req.user!.collegeId,
      },
      select: {
        id: true,
        code: true,
        name: true,
        professor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(classes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get students in a specific class
router.get("/:id/students", requireRole(["PROFESSOR", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify the professor has access to this class
    const classExists = await prisma.class.findFirst({
      where: {
        id,
        professorId: req.user!.id,
        collegeId: req.user!.collegeId,
      },
    });

    if (!classExists) {
      return res.status(404).json({ error: "Class not found" });
    }

    const students = await prisma.user.findMany({
      where: {
        attendance: {
          some: {
            classId: id,
          },
        },
        role: "STUDENT",
        collegeId: req.user!.collegeId,
      },
      select: {
        id: true,
        name: true,
        rollNo: true,
      },
    });

    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
