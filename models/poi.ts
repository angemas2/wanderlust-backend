import { Schema, model } from "mongoose";

export interface IPoi {
  profile_id: string;
  name: string;
  description: string;
  photos: string[] | undefined;
  location: { latitude: number; longitude: number };
  tags_id: string[] | undefined;
}

const poiSchema = new Schema<IPoi>({
  profile_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  photos: { type: String, required: false },
  location: { type: Object, required: true },
  tags_id: { type: Array, required: true },
});

const Poi = model<IPoi>("poi", poiSchema);

module.exports = Poi;
