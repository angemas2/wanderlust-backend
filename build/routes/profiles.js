"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
require("../models/connection");
const Profile = require("../models/profiles");
const uid2 = require("uid2");
module.exports = router;
