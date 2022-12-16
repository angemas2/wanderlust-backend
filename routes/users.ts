var express = require('express');
var router = express.Router();

require('../models/connection');
import { Request, Response } from 'express';
import { IUser } from '../models/users';
import { IProfile } from '../models/profiles';
import checkBody from '../modules/checkBody';

const User = require('../models/users');
const Profile = require('../models/profiles');

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req: Request, res: Response) => {
  // Check if username and password are both given by user in frontend
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  // Create a Profile

  const newProfile = new Profile({
    picture: 'default.png',
    location: 'Unknown',
    name: 'Unknown',
    firstName: 'Unknown',
    activities_id: 'default',
    bio: 'none',
    preferences: { id: 'default', weight: 0, liked: false },
    badge_id: 'default',
  });

  newProfile.save().then((profileData: IProfile) => {
    User.findOne({ email: req.body.email }).then((userData: IUser) => {
      // Check if User's email han not already been registered. If no, create User
      if (!userData) {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          token: uid2(32),
          profile_id: profileData.id,
          registrationBy: 'email',
        });

        newUser.save().then((data: IUser) => {
          User.findOne({ email: data.email })
            .populate('profile_id')
            .then(
              res.json({
                result: true,
                token: data.token,
                profile_id: data.profile_id,
              })
            );
        });
        // If yes, Delete Profile and send error
      } else {
        console.log(profileData.id);
        Profile.findByIdAndDelete(profileData.id).then(
          res.json({
            result: false,
            error: 'Utilisateur existant pour cette adresse email',
          })
        );
      }
    });
  });
});

router.post('/signin', (req: Request, res: Response) => {
  // Check if username and password are both given by user in frontend
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      //username & password of user are correct, connection allowed
      res.json({
        result: true,
        token: data.token,
        profile_id: data.profile_id,
      });
    } else {
      //username & password of user are incorrect, connection denied
      res.json({ result: false, error: 'Utilisateur ou mot de passe erronné' });
    }
  });
});

router.post('/facebook', (req: Request, res: Response) => {
  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data === null) {
      const newProfile = new Profile({
        picture: 'default.png',
        location: 'Unknown',
        name: 'Unknown',
        firstName: 'Unknown',
        activities_id: 'default',
        bio: 'none',
        preferences: { id: 'default', weight: 0, liked: false },
        badge_id: 'default',
      });

      newProfile.save().then((profileData: IProfile) => {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          token: uid2(32),
          profile_id: profileData.id,
          registrationBy: 'facebook',
        });

        newUser.save().then((data: IUser) => {
          res.json({
            result: true,
            token: data.token,
            profile_id: data.profile_id,
          });
        });
      });
    } else {
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

router.post('/google', (req: Request, res: Response) => {
  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data === null) {
      const newProfile = new Profile({
        picture: 'default.png',
        location: 'Unknown',
        name: 'Unknown',
        firstName: 'Unknown',
        activities_id: 'default',
        bio: 'none',
        preferences: { id: 'default', weight: 0, liked: false },
        badge_id: 'default',
      });

      newProfile.save().then((profileData: IProfile) => {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          token: uid2(32),
          profile_id: profileData.id,
          registrationBy: 'google',
        });

        newUser.save().then((data: IUser) => {
          res.json({
            result: true,
            token: data.token,
            profile_id: data.profile_id,
          });
        });
      });
    } else {
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

module.exports = router;
