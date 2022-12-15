"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
require("../models/connection");
const Profile = require("../models/profiles");
const uid2 = require("uid2");
router.post("/signup", (req, res) => {
    const newProfile = new Profile({
        profile_id: uid2(32),
        picture: "default",
    });
    newProfile.save().then((data) => {
        res.json({
            result: true,
            profile_id: data.profile_id,
        });
    });
});
module.exports = router;
