const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IItinerary {
  profile_id: ObjectId;
  viewpoints_id: ObjectId;
  km: Number;
  map: String;
  photos: String[] | null;
  name: String;
  description: String;
  isPublic: Boolean;
  isCustom: Boolean;
  rating: Number;
  tags: String[] | null;
  followers: String[] | null;
  isSponsor: Boolean;
  city: String;
}

const itinerarySchema = new Schema<IItinerary>({
  profile_id: { type: Number, required: false },
  viewpoints_id: { type: mongoose.Schema.Types.ObjectId, ref: "viewpoints" },
  km: { type: Number, required: true },
  isPublic: { type: Boolean, required: true },
  isCustom: { type: Boolean, required: true },
  isSponsor: { type: Boolean, required: true },
  rating: { type: Number, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: false },
  photos: { type: String, required: false },
  tags: { type: Array, required: true },
  followers: { type: Array, required: false },
});

const Itinerary = model<IItinerary>("itineraries", itinerarySchema);

module.exports = Itinerary;
