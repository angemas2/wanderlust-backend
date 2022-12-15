const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IPoi {
  profile_id: ObjectId;
  name: string;
  description: string;
  photos: string[] | null;
  location: { latitude: number; longitude: number };
  tags_id: string[] | null;
}

const viewpointSchema = new Schema<IPoi>({
  profile_id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  photos: { type: String, required: false },
  location: { type: Object, required: true },
  tags_id: { type: Array, required: true },
});

const Viewpoint = model<IPoi>("viewpoints", viewpointSchema);

module.exports = Viewpoint;
