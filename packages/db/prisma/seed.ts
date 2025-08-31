import { PrismaClient, Role, RSVPStatus, AttendanceStatus } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Professors ---
  const profJohn = await prisma.user.upsert({
    where: { email: "john@campusone.edu" },
    update: {},
    create: {
      name: "Prof. John Doe",
      email: "john@campusone.edu",
      password: "hashed_password",
      role: Role.PROFESSOR,
    },
  });

  const profAlice = await prisma.user.upsert({
    where: { email: "alice@campusone.edu" },
    update: {},
    create: {
      name: "Prof. Alice Smith",
      email: "alice@campusone.edu",
      password: "hashed_password",
      role: Role.PROFESSOR,
    },
  });

  // --- Students ---
  const studentBob = await prisma.user.upsert({
    where: { email: "bob@student.edu" },
    update: {},
    create: {
      name: "Bob Student",
      email: "bob@student.edu",
      password: "hashed_password",
      role: Role.STUDENT,
    },
  });

  const studentCarol = await prisma.user.upsert({
    where: { email: "carol@student.edu" },
    update: {},
    create: {
      name: "Carol Student",
      email: "carol@student.edu",
      password: "hashed_password",
      role: Role.STUDENT,
    },
  });

  // --- Notes ---
  await prisma.note.upsert({
    where: { id: "note-dbms" }, // use fixed IDs to prevent duplicates
    update: {},
    create: {
      id: "note-dbms",
      title: "Database Systems Notes",
      description: "Week 1 – Intro to DBMS",
      fileUrl: "https://files.campusone.edu/dbms-week1.pdf",
      uploadedBy: profJohn.id,
    },
  });

  await prisma.note.upsert({
    where: { id: "note-os" },
    update: {},
    create: {
      id: "note-os",
      title: "Operating Systems Notes",
      description: "Week 2 – Processes and Threads",
      fileUrl: "https://files.campusone.edu/os-week2.pdf",
      uploadedBy: profAlice.id,
    },
  });

  // --- Events ---
  const hackathon = await prisma.event.upsert({
    where: { id: "event-hackathon" },
    update: {},
    create: {
      id: "event-hackathon",
      title: "Campus Hackathon",
      description: "24-hour coding challenge",
      date: new Date("2025-09-15"),
      createdBy: profJohn.id,
    },
  });

  const workshop = await prisma.event.upsert({
    where: { id: "event-workshop" },
    update: {},
    create: {
      id: "event-workshop",
      title: "AI Workshop",
      description: "Introduction to AI/ML",
      date: new Date("2025-10-01"),
      createdBy: profAlice.id,
    },
  });

  // --- RSVPs ---
  await prisma.rSVP.upsert({
    where: { id: "rsvp-bob-hackathon" },
    update: {},
    create: {
      id: "rsvp-bob-hackathon",
      userId: studentBob.id,
      eventId: hackathon.id,
      status: RSVPStatus.ACCEPTED,
    },
  });

  await prisma.rSVP.upsert({
    where: { id: "rsvp-carol-workshop" },
    update: {},
    create: {
      id: "rsvp-carol-workshop",
      userId: studentCarol.id,
      eventId: workshop.id,
      status: RSVPStatus.PENDING,
    },
  });

  // --- Attendance ---
  await prisma.attendance.upsert({
    where: { id: "attendance-bob-cs101" },
    update: {},
    create: {
      id: "attendance-bob-cs101",
      studentId: studentBob.id,
      professorId: profJohn.id,
      classId: "CS101",
      date: new Date(),
      status: AttendanceStatus.PRESENT,
    },
  });

  await prisma.attendance.upsert({
    where: { id: "attendance-carol-cs101" },
    update: {},
    create: {
      id: "attendance-carol-cs101",
      studentId: studentCarol.id,
      professorId: profJohn.id,
      classId: "CS101",
      date: new Date(),
      status: AttendanceStatus.ABSENT,
    },
  });

  console.log("✅ Database has been fully seeded (idempotent)!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
