import {prisma} from "@campusone/db";
import { RSVPStatus } from "@prisma/client";

// ✅ Create Event (college-aware)
export const createEvent = async (data: {
  title: string;
  description?: string;
  date: Date;
  createdBy: string;
  collegeId: string;
}) => {
  return await prisma.event.create({
    data,
    include: { creator: { select: { id: true, name: true, email: true } } },
  });
};

// ✅ Get All Events (college scoped)
export const getEvents = async (collegeId: string) => {
  return await prisma.event.findMany({
    where: { collegeId },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      rsvps: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { date: "asc" },
  });
};

// ✅ Get Event by ID (college scoped)
export const getEventById = async (id: string, collegeId: string) => {
  return await prisma.event.findFirst({
    where: { id, collegeId },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      rsvps: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });
};

// ✅ RSVP (college scoped)
export const rsvpToEvent = async (
  eventId: string,
  userId: string,
  collegeId: string,
  status: RSVPStatus
) => {
  // Make sure the event belongs to this college
  const event = await prisma.event.findFirst({ where: { id: eventId, collegeId } });
  if (!event) throw new Error("Event not found or not in your college");

  return await prisma.rSVP.upsert({
    where: { id: `${userId}-${eventId}` },
    update: { status },
    create: { id: `${userId}-${eventId}`, eventId, userId, status, collegeId },
  });
};
