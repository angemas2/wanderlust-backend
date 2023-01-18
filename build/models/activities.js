"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    itinerary_id: { type: mongoose.Schema.Types.ObjectId, ref: "itineraries" },
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "profiles" },
    photos: { type: [String], required: false },
    date: { type: Date, required: true },
    type: { type: String, required: true },
});
const Activity = (0, mongoose_1.model)("activities", activitySchema);
module.exports = Activity;
