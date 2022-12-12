"use strict";
var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
router.post("/signup", (req, res) => {
    if (!checkBody(req.body, ["username", "password"])) {
        res.json({ result: false, error: "Champs vides ou manquants" });
        return;
    }
    // Check if the user han not already been registered
    User.findOne({ username: req.body.username }).then((data) => {
        if (data === null) {
            const hash = bcrypt.hashSync(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                token: uid2(32),
                profile_id: uid2(32),
            });
            newUser.save().then((data) => {
                res.json({
                    result: true,
                    token: newUser.token,
                    profile_id: newUser.profile_id,
                });
            });
        }
        else {
            //user already exists in database
            res.json({ result: false, error: "L'utilisateur existe déjà" });
        }
    });
});
module.exports = router;
