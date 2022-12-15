"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");
const Profile = require("../models/profiles");
const checkBody_1 = __importDefault(require("../modules/checkBody"));
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
router.post("/signup", (req, res) => {
    // Check if username and password are both given by user in frontend
    if (!(0, checkBody_1.default)(req.body, ["username", "email", "password"])) {
        res.json({ result: false, error: "Champs vides ou manquants" });
        return;
    }
    // Check if the user han not already been registered
    User.findOne({ email: req.body.email }).then((data) => {
        if (data === null) {
            const hash = bcrypt.hashSync(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                token: uid2(32),
                profile_id: uid2(32),
                registrationBy: req.body.registrationBy,
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
router.post("/signin", (req, res) => {
    // Check if username and password are both given by user in frontend
    if (!(0, checkBody_1.default)(req.body, ["email", "password"])) {
        res.json({ result: false, error: "Champs vides ou manquants" });
        return;
    }
    User.findOne({ email: req.body.email }).then((data) => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            //username & password of user are correct, connection allowed
            res.json({
                result: true,
                token: data.token,
                profile_id: data.profile_id,
            });
        }
        else {
            //username & password of user are incorrect, connection denied
            res.json({ result: false, error: "Utilisateur ou mot de passe erronné" });
        }
    });
});
router.post("/facebook", (req, res) => {
    // Check if the user han not already been registered
    User.findOne({ email: req.body.email }).then((data) => {
        if (data === null) {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                token: uid2(32),
                profile_id: uid2(32),
                registrationBy: req.body.registrationBy,
            });
            newUser.save().then((data) => {
                res.json({
                    result: true,
                    username: data.username,
                    token: data.token,
                    profile_id: data.profile_id,
                });
            });
        }
        else {
            //user already exists in database
            res.json({
                result: true,
                username: data.username,
                token: data.token,
                profile_id: data.profile_id,
            });
        }
    });
});
router.post("/google", (req, res) => {
    // Check if the user han not already been registered
    User.findOne({ email: req.body.email }).then((data) => {
        if (data === null) {
            //create new profile
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                token: uid2(32),
                profile_id: uid2(32),
                registrationBy: req.body.registrationBy,
            });
            newUser.save().then((data) => {
                res.json({
                    result: true,
                    username: data.username,
                    token: data.token,
                    profile_id: data.profile_id,
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
