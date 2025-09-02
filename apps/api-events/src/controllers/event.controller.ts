import { Response } from "express";
import { AuthRequest } from "../middleware/auth.ts";
import * as eventService from "../services/event.service.ts";

// ✅ Create Event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date } = req.body;

    const event = await eventService.createEvent({
      title,
      description,
      date,
      createdBy: req.user!.id,
      collegeId: req.user!.collegeId,
    });

    res.status(201).json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Events
export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await eventService.getEvents(req.user!.collegeId);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Event by ID
export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user!.collegeId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ RSVP to Event
export const rsvpToEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const rsvp = await eventService.rsvpToEvent(
      id,
      req.user!.id,
      req.user!.collegeId,
      status
    );

    res.status(201).json(rsvp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
