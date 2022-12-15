import { Schema, model } from "mongoose";

export interface IProfile {
    profile_id: string;
    picture: string;
    location: string;
    name: string;
    firstName: string;
    activities_id: string;
    bio: string;
    preferences:  {id: string; weight: number, liked: boolean}
    badge_id: string,
}

const ProfileSchema = new Schema<IProfile>({
    profile_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    picture: { type: String, required: true },
    location: { type: String, required: false },
    name: { type: String, required: false },
    firstName: { type: String, required: false},
    activities_id: { type: String, required: false},
    bio: { type: String, required: false},
    preferences: {type: Object, required: false},
    badge_id: {type:String, required: false},
});

const Profile = model<IProfile>('profiles', ProfileSchema);

module.exports = Profile;