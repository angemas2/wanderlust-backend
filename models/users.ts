import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
    token: string;
    profile_id: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true},
    profile_id: { type: String, required: true},
});

const User = model<IUser>('users', userSchema);

module.exports = User;