"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const itinerarySchema = new mongoose_1.Schema({
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "profiles" },
    viewpoints_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "viewpoints" }],
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
const Itinerary = (0, mongoose_1.model)("itineraries", itinerarySchema);
module.exports = Itinerary;
