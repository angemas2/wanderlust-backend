"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProfileSchema = new mongoose_1.Schema({
    profile_id: { type: String, required: true },
    picture: { type: String, required: true },
    location: { type: String, required: false },
    name: { type: String, required: false },
    firstName: { type: String, required: false },
    activities_id: { type: String, required: true },
    bio: { type: String, required: false },
    preferences: { type: Object, required: false },
    badge_id: { type: String, required: false },
});
const Profile = (0, mongoose_1.model)('profiles', ProfileSchema);
module.exports = Profile;
