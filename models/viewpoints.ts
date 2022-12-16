const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IPoi {
  name: string;
  description: string;
  photos?: string[];
  location: { latitude: number; longitude: number };
  tags_id?: string[];
}

const viewpointSchema = new Schema<IPoi>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  photos: { type: String, required: false },
  location: { type: Object, required: true },
  tags_id: { type: Array, required: false },
});

const Viewpoint = model<IPoi>("viewpoints", viewpointSchema);

module.exports = Viewpoint;
