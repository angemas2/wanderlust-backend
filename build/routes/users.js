"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
require('../models/connection');
const checkBody_1 = __importDefault(require("../modules/checkBody"));
const User = require('../models/users');
const Profile = require('../models/profiles');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const avatar = process.env.DEFAULT_AVATAR;
router.post('/signup', (req, res) => {
    // Check if username and password are both given by user in frontend
    if (!(0, checkBody_1.default)(req.body, ['username', 'email', 'password'])) {
        res.json({ result: false, error: 'Champs vides ou manquants' });
        return;
    }
    // Create a Profile
    const newProfile = new Profile({
        picture: avatar,
        location: 'Unknown',
        name: 'Unknown',
        firstName: 'Unknown',
        activities_id: 'default',
        bio: 'none',
        preferences: { id: 'default', weight: 0, liked: false },
        badge_id: 'default',
    });
    newProfile.save().then((profileData) => {
        User.findOne({ email: req.body.email }).then((userData) => {
            // Check if User's email han not already been registered. If no, create User
            if (!userData) {
                User.findOne({ username: req.body.username }).then((data) => {
                    if (!data) {
                        const hash = bcrypt.hashSync(req.body.password, 10);
                        const newUser = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            token: uid2(32),
                            profile_id: profileData.id,
                            registrationBy: 'email',
                        });
                        newUser.save().then((data) => {
                            User.findOne({ email: data.email })
                                .populate('profile_id')
                                .then((newData) => {
                                res.json({
                                    result: true,
                                    email: newData.email,
                                    username: newData.username,
                                    token: newData.token,
                                    profile_id: newData.profile_id,
                                });
                            });
                        });
                    }
                    else {
                        Profile.findByIdAndDelete(profileData.id).then(res.json({
                            result: false,
                            error: "Nom d'utilisateur déjà pris",
                        }));
                    }
                });
                // If yes, Delete Profile and send error
            }
            else {
                Profile.findByIdAndDelete(profileData.id).then(res.json({
                    result: false,
                    error: 'Utilisateur existant pour cette adresse email',
                }));
            }
        });
    });
});
router.post('/signin', (req, res) => {
    // Check if username and password are both given by user in frontend
    if (!(0, checkBody_1.default)(req.body, ['email', 'password'])) {
        res.json({ result: false, error: 'Champs vides ou manquants' });
        return;
    }
    User.findOne({ email: req.body.email }).then((data) => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            User.findOne({ email: data.email })
                .populate('profile_id')
                .then((newData) => {
                res.json({
                    result: true,
                    email: newData.email,
                    username: newData.username,
                    token: newData.token,
                    profile_id: newData.profile_id,
                });
            });
        }
        else {
            //username & password of user are incorrect, connection denied
            res.json({ result: false, error: 'Utilisateur ou mot de passe erronné' });
        }
    });
});
router.post('/facebook', (req, res) => {
    // Check if the user han not already been registered
    User.findOne({ facebook_id: req.body.facebook_id }).then((data) => {
        if (data === null) {
            const newProfile = new Profile({
                picture: req.body.picture,
                location: 'Unknown',
                name: req.body.last_name,
                firstName: req.body.first_name,
                activities_id: 'default',
                bio: 'none',
                preferences: { id: 'default', weight: 0, liked: false },
                badge_id: 'default',
            });
            newProfile.save().then((profileData) => {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    token: uid2(32),
                    profile_id: profileData.id,
                    registrationBy: 'facebook',
                    facebook_id: req.body.facebook_id,
                });
                newUser.save().then((data) => {
                    User.findOne({ email: data.email })
                        .populate('profile_id')
                        .then(res.json({
                        result: true,
                        email: data.email,
                        username: data.username,
                        token: data.token,
                        profile_id: data.profile_id,
                    }));
                });
            });
        }
        else {
            //user already exists in database
            User.findOne({ facebook_id: req.body.facebook_id })
                .populate('profile_id')
                .then((data) => {
                res.json({
                    result: true,
                    email: data.email,
                    username: data.username,
                    token: data.token,
                    profile_id: data.profile_id,
                });
            });
        }
    });
});
router.post('/google', (req, res) => {
    // Check if the user han not already been registered
    User.findOne({ google_id: req.body.google_id }).then((data) => {
        if (data === null) {
            const newProfile = new Profile({
                picture: req.body.picture,
                location: 'Unknown',
                name: 'Unknown',
                firstName: 'Unknown',
                activities_id: 'default',
                bio: 'none',
                preferences: { id: 'default', weight: 0, liked: false },
                badge_id: 'default',
            });
            newProfile.save().then((profileData) => {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    token: uid2(32),
                    profile_id: profileData.id,
                    registrationBy: 'google',
                    google_id: req.body.google_id,
                });
                newUser.save().then((data) => {
                    User.findOne({ email: data.email })
                        .populate('profile_id')
                        .then(res.json({
                        result: true,
                        email: data.email,
                        username: data.username,
                        token: data.token,
                        profile_id: data.profile_id,
                    }));
                });
            });
        }
        else {
            //user already exists in database
            User.findOne({ google_id: req.body.google_id })
                .populate('profile_id')
                .then((data) => {
                res.json({
                    result: true,
                    email: data.email,
                    username: data.username,
                    token: data.token,
                    profile_id: data.profile_id,
                });
            });
        }
    });
});
router.get('/:profile_id', (req, res) => {
    User.findOne({ profile_id: req.params.profile_id })
        .populate('profile_id')
        .then((data) => {
        if (!data) {
            res.json({ result: false, error: 'no profile found with this profile ID' });
        }
        else {
            res.json({ result: true, data: data });
        }
    });
});
router.put('/changePassword/:token', (req, res) => {
    if (!(0, checkBody_1.default)(req.body, ['currentPassword', 'newPassword', 'testNewPassword'])) {
        res.json({ result: false, error: 'Empty or missing fields.' });
        return;
    }
    User.findOne({ token: req.params.token }).then((userData) => {
        if (!userData) {
            res.json({ result: false, error: 'no user found. Try again.' });
        }
        else if (userData && bcrypt.compareSync(req.body.newPassword, userData.password)) {
            res.json({ result: false, error: 'New password is the same than current password' });
        }
        else if (userData && bcrypt.compareSync(req.body.currentPassword, userData.password)) {
            const hash = bcrypt.hashSync(req.body.newPassword, 10);
            User.updateOne({ token: req.params.token }, { password: hash }).then((data) => {
                if (data) {
                    res.json({ result: true, data: data });
                }
                else {
                    res.json({ result: false, error: 'An error occured. Please try again' });
                }
            });
        }
        else {
            res.json({ result: false, error: 'Wrong current password. Please verify your typing' });
        }
    });
});
module.exports = router;
