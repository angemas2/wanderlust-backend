import { Request, Response } from "express";
import { IUser } from "../models/users";
var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
import checkBody from "../modules/checkBody";
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req: Request, res: Response) => {
  // Check if username and password are both given by user in frontend
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  // Check if the user han not already been registered
  User.findOne({ email: req.body.email }).then((data: IUser) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        profile_id: uid2(32),
      });

      newUser.save().then((data: IUser) => {
        res.json({
          result: true,
          token: newUser.token,
          profile_id: newUser.profile_id,
        });
      });
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

  User.findOne({ username: req.body.email }).then((data: IUser) => {
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

module.exports = router;
