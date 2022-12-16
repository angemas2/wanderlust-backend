var express = require("express");
var router = express.Router();
import { Request, Response } from "express";
import { IProfile } from "../models/profiles";
import { IUser } from "../models/users";

require("../models/connection");

const Profile = require("../models/profiles");
const uid2 = require("uid2");

module.exports = router;