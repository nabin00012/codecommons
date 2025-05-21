import { Request, Response } from "express";
import { Event } from "../models/Event";

export const eventController = {
  // Create a new event
  async create(req: Request, res: Response) {
    try {
      const { title, description, date, location, tags, maxAttendees } =
        req.body;
      const organizer = req.user._id;

      const event = await Event.create({
        title,
        description,
        date,
        location,
        organizer,
        tags,
        maxAttendees,
        attendees: [organizer], // Organizer is automatically an attendee
      });

      await event.populate("organizer", "name department avatar");
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  },

  // Get all events with pagination
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const events = await Event.find()
        .populate("organizer", "name department avatar")
        .populate("attendees", "name department avatar")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Event.countDocuments();

      res.json({
        events,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error });
    }
  },

  // Get a single event by ID
  async getById(req: Request, res: Response) {
    try {
      const event = await Event.findById(req.params.id)
        .populate("organizer", "name department avatar")
        .populate("attendees", "name department avatar");

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event", error });
    }
  },

  // Update an event
  async update(req: Request, res: Response) {
    try {
      const { title, description, date, location, tags, maxAttendees } =
        req.body;
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Only organizer can update the event
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this event" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          date,
          location,
          tags,
          maxAttendees,
        },
        { new: true }
      )
        .populate("organizer", "name department avatar")
        .populate("attendees", "name department avatar");

      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error });
    }
  },

  // Delete an event
  async delete(req: Request, res: Response) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Only organizer can delete the event
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this event" });
      }

      await event.deleteOne();
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  },

  // Join/Leave an event
  async toggleAttendance(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const isAttending = event.attendees.includes(userId);

      if (isAttending) {
        // Can't leave if you're the organizer
        if (event.organizer.toString() === userId.toString()) {
          return res
            .status(400)
            .json({ message: "Organizer cannot leave the event" });
        }
        event.attendees = event.attendees.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // Check if event is full
        if (
          event.maxAttendees &&
          event.attendees.length >= event.maxAttendees
        ) {
          return res.status(400).json({ message: "Event is full" });
        }
        event.attendees.push(userId);
      }

      await event.save();
      await event.populate("attendees", "name department avatar");
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error toggling attendance", error });
    }
  },

  // Search events
  async search(req: Request, res: Response) {
    try {
      const { query, tags, dateRange } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      let searchQuery: any = {};

      if (query) {
        searchQuery.$text = { $search: query as string };
      }

      if (tags) {
        searchQuery.tags = { $in: (tags as string).split(",") };
      }

      if (dateRange) {
        const [start, end] = (dateRange as string).split(",");
        searchQuery.date = {
          $gte: new Date(start),
          $lte: new Date(end),
        };
      }

      const events = await Event.find(searchQuery)
        .populate("organizer", "name department avatar")
        .populate("attendees", "name department avatar")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Event.countDocuments(searchQuery);

      res.json({
        events,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    } catch (error) {
      res.status(500).json({ message: "Error searching events", error });
    }
  },
};
