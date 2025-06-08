import mongoose from "mongoose";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxAttendees: {
      type: Number,
      default: 100,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
