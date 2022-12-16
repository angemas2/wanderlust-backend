const mongoose = require("mongoose");
import { Schema, model, ObjectId } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  token: string;
  profile_id: ObjectId;
  registrationBy: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    token: { type: String, required: true},
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "profiles", required: true},
    registrationBy: { type: String, required: true},
});

const User = model<IUser>("users", userSchema);

module.exports = User;
