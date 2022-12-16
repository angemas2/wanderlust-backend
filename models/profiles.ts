import { Schema, model, ObjectExpressionOperatorReturningObject, ObjectId } from "mongoose";

export interface IProfile {
    id: ObjectId
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