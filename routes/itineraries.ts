var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IPoi } from "../models/viewpoints";
import { IItinerary } from "../models/itineraries";
const Viewpoint = require("../models/viewpoints");
const Itinerary = require("../models/itineraries");

router.post("/addItinerary", (req: Request, res: Response) => {
  Itinerary.findOne({ name: req.body.name }).then((data: IItinerary) => {
    if (!data) {
      const NewItinerary = new Itinerary({
        profile_id: 1348,
        viewpoints_id: req.body.viewpoints_id,
        km: 12,
        map: "",
        photos: "",
        name: req.body.name,
        description: req.body.description,
        isPublic: false,
        isCustom: false,
        rating: 3,
        tags: "",
        followers: "",
        isSponsor: false,
      });

      NewItinerary.save().then((x: any) => {
        Itinerary.find()
          .populate("viewpoints_id")
          .then((data: IItinerary) => res.json({ data }));
      });
    } else {
      res.json({ result: false, error: "itinerary already exists" });
    }
  });
});

router.get("/:city", (req: Request, res: Response) => {
  Itinerary.find({ profile_id: req.params.city }).then((data: IItinerary) => {
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "no itinerary" });
    }
  });
});

module.exports = router;
