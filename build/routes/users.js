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
// the road below allow user to register with his email's address
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
//the road below handle the login of user with his email address
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
/* the following roads (/facebook & /google) below handle the registration & login of a user
with a Facebook or a Google account. Due that user's need to allow these
social networks to allow the sharing of their informations and to be connected on them,
the authentification part is handle by these networks. Therefore, these roads works the exact same way :
a check is done on the personnal ID given by the network :
on first connection, this ID is registered in DB. If it is already registered,
then the user is logged to the app */
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
//the road below use the user's profile's ID to get all his informations account
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
/* the following roads allow user to change his informations.
Token is used in these roads as the primary source of research in DB */
/*the road below allow user to update username & email address
be aware than only one information (username or email address) can be updated at a time :
if user try to updated both, only email address will be updated if possible,
username part will be ignored.
*/
router.put('/updateUserInfo/:token', (req, res) => {
    User.findOne({ token: req.params.token }).then((userData) => {
        if (!userData) {
            res.json({ result: false, error: 'No user found. Try again.' }); // if no user is found in DB with the given token in params, return an error message
        }
        else if (req.body.email) {
            // check if a new email address is given by user
            User.findOne({ email: req.body.email }).then((userData) => {
                // check if new email adress already exist in DB
                userData
                    ? res.json({ result: false, error: 'Email address already registered' }) // if yes, then return an error message
                    : User.updateOne({ token: req.params.token }, { email: req.body.email }).then((emailData) => {
                        emailData
                            ? res.json({ result: true, response: 'Email address updated succesfully' }) // if no, then email address is updated
                            : res.json({ result: false, error: 'An error occured. Try again' }); // if email address isn't registered but cannot be updated for some reason, then return an error message
                    });
            });
        }
        else if (req.body.username) {
            // check if a new username is given by user
            User.findOne({ username: req.body.username }).then((userData) => {
                // check if new username is not already registered in DB
                userData
                    ? res.json({ result: false, error: 'Username already taken' }) // if yes, then return an error message
                    : User.updateOne({ token: req.params.token }, { username: req.body.username }).then((usernameData) => {
                        usernameData
                            ? res.json({ result: true, response: 'Username updated succesfully' }) // if no, than username is updated
                            : res.json({ result: false, error: 'An error occured. Try again' }); // if username isn't registered but cannot be updated for some reason, then return an error message
                    });
            });
        }
    });
});
// the road below allow user to change his password
router.put('/changePassword/:token', (req, res) => {
    if (!(0, checkBody_1.default)(req.body, ['currentPassword', 'newPassword', 'testNewPassword'])) {
        // Check all fields are given by user in frontend
        res.json({ result: false, error: 'Empty or missing fields.' });
        return;
    }
    User.findOne({ token: req.params.token }).then((userData) => {
        if (!userData) {
            res.json({ result: false, error: 'No user found. Try again.' }); // if no user is found in DB with the given token in params, return an error message
        }
        else if (userData && bcrypt.compareSync(req.body.newPassword, userData.password)) {
            res.json({ result: false, error: 'New password is the same than current password' }); // if user type the same password than current registered in DB, return an error message
        }
        else if (userData && bcrypt.compareSync(req.body.currentPassword, userData.password)) {
            const hash = bcrypt.hashSync(req.body.newPassword, 10); //variable called to hash new password given by user when registering it in DB.
            User.updateOne({ token: req.params.token }, { password: hash }).then((data) => {
                data
                    ? res.json({ result: true, data: data }) // if everything is OK, change the password in DB
                    : res.json({ result: false, error: 'An error occured. Please try again' }); // if despite everything seems to be OK but password cannot be change, return an error message
            });
        }
        else {
            res.json({ result: false, error: 'Wrong current password. Please verify your typing' }); // if user mystype his current password registered in DB, return an error message
        }
    });
});
module.exports = router;
