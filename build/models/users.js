"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    token: { type: String, required: true },
    profile_id: { type: String, required: true },
    registrationBy: { type: String, required: true },
});
const User = (0, mongoose_1.model)("users", userSchema);
module.exports = User;
