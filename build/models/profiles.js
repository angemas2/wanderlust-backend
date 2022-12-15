"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProfileSchema = new mongoose_1.Schema({
<<<<<<< HEAD
    profile_id: { type: String, required: true },
=======
    profile_id: { type: mongoose.Schema.Types.ObjectId, required: true },
>>>>>>> 49d9b144e019b562b1f2727a5e48d9dd5449ae86
    picture: { type: String, required: true },
    location: { type: String, required: false },
    name: { type: String, required: false },
    firstName: { type: String, required: false },
<<<<<<< HEAD
    activities_id: { type: String, required: true },
=======
    activities_id: { type: String, required: false },
>>>>>>> 49d9b144e019b562b1f2727a5e48d9dd5449ae86
    bio: { type: String, required: false },
    preferences: { type: Object, required: false },
    badge_id: { type: String, required: false },
});
const Profile = (0, mongoose_1.model)('profiles', ProfileSchema);
module.exports = Profile;
