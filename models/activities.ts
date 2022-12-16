const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IActivity {
  itineraries_id: ObjectId[];
  photos: String[] | null;
}

const activitySchema = new Schema<IActivity>({
  itineraries_id: [
    { type: mongoose.Schema.Types.ObjectId, ref: "itineraries" },
  ],
  photos: { type: String, required: false },
});

const Activity = model<IActivity>("activities", activitySchema);

module.exports = Activity;
