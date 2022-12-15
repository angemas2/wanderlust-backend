import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  token: string;
  profile_id: string;
  registrationBy: string;
}

const userSchema = new Schema<IUser>({

    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    token: { type: String, required: true},
    profile_id: { type: String, required: false},
    registrationBy: { type: String, required: true},

});

const User = model<IUser>("users", userSchema);

module.exports = User;
