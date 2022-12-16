"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    itineraries_id: [
        { type: mongoose.Schema.Types.ObjectId, ref: "itineraries" },
    ],
    photos: { type: String, required: false },
});
const Activity = (0, mongoose_1.model)("activities", activitySchema);
module.exports = Activity;
