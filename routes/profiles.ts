var express = require("express");
var router = express.Router();
import { Request, Response } from "express";
import { IProfile } from "../models/profiles";
import { IUser } from "../models/users";

require("../models/connection");

const Profile = require("../models/profiles");
const uid2 = require("uid2");


router.post("/signup", (req: Request, res: Response) => {
  
  
        const newProfile = new Profile({
          profile_id: uid2(32),
          picture: "default",
        });
  
        newProfile.save().then((data: IProfile) => {
          res.json({
            result: true,
            profile_id: data.profile_id,
          });
        });
    });

module.exports = router;
