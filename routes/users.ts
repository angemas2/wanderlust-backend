var express = require("express");
var router = express.Router();

require("../models/connection");
import { Request, Response } from "express";
import { IUser } from "../models/users";
import { IProfile } from "../models/profiles";
import checkBody from "../modules/checkBody";

const User = require("../models/users");
const Profile = require("../models/profiles");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req: Request, res: Response) => {
  // Check if username and password are both given by user in frontend
  if (!checkBody(req.body, ["username","email", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }
  // Create a Profile

  const newProfile = new Profile({
    profile_id: uid2(32),
    picture: "default",
  }); 

  newProfile.save().then((profileData:IProfile) => {
    User.findOne({email:req.body.email}).then((userData:IUser) => {
      if (data) {
        findAndDeleteOne({ data })
      }
  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        profile_id: "null",
        registrationBy: req.body.registrationBy
      });

     
          // - Check if User exists
          // -- If yes > Delete Profile and send error
          // Profile.findOneandDelete({_id:profileData._id}).then(retourne l'erreur)
          // -- If not > Create a user and add Profile ID to User
          newUser.save().then((data: IUser) => {
            res.json({
              result: true,
            });
          });
        })
      })
    } else {
      //user already exists in database
      res.json({ result: false, error: "L'utilisateur existe déjà" });
    }
  });
});

router.post("/signin", (req: Request, res: Response) => {
  // Check if username and password are both given by user in frontend
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
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
      res.json({ result: false, error: "Utilisateur ou mot de passe erronné" });
    }
  });
});

router.post("/facebook", (req: Request, res: Response) => {

  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data === null) {

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        profile_id: uid2(32),
        registrationBy: req.body.registrationBy
      });

      newUser.save().then((data: IUser) => {
        res.json({
          result: true,
          username: data.username,
          token: data.token,
          profile_id: data.profile_id,
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

router.post("/google", (req: Request, res: Response) => {

  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data === null) {

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        profile_id: uid2(32),
        registrationBy: req.body.registrationBy
      });

      newUser.save().then((data: IUser) => {
        res.json({
          result: true,
          username: data.username,
          token: data.token,
          profile_id: data.profile_id,
        });
      });
    } else {
      //user already exists in database
      res.json({ result: false, error: "L'utilisateur existe déjà" });
    }
  });
});

router.put("changeProfileID/:email", (req: Request, res: Response) => {
  User.updateOne(
    {email: req.params.email}, 
    {profile_id: req.params.profile_id}
    ).then((data: IUser) => {
      if (data) {
        res.json({
          result: true,
          profile_id: data.profile_id,
        })
      }
    })
})

module.exports = router;
