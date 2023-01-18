const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IActivity {
  itinerary_id: ObjectId;
  profile_id: ObjectId;
  photos: String[] | null;
  date: Date;
  type: String;
}

const activitySchema = new Schema<IActivity>({
  itinerary_id: { type: mongoose.Schema.Types.ObjectId, ref: "itineraries" },
  profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "profiles" },
  photos: { type: [String], required: false },
  date: { type: Date, required: true },
  type: { type: String, required: true },
});

const Activity = model<IActivity>("activities", activitySchema);

module.exports = Activity;
