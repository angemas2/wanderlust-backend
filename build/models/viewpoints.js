"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const viewpointSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    photos: { type: String, required: false },
    location: { type: Object, required: true },
    tags_id: { type: Array, required: false },
});
const Viewpoint = (0, mongoose_1.model)("viewpoints", viewpointSchema);
module.exports = Viewpoint;
