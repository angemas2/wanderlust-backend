var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IActivity } from "../models/activities";

const Activity = require("../models/activities");

router.get("/", (req: Request, res: Response) => {
  Activity.find({ city: req.params.city })
    .populate("itineraries_id")
    .then((data: IActivity) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "no itinerary" });
      }
    });
});

module.exports = router;
