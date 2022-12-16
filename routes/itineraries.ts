var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IPoi } from "../models/viewpoints";
import { IItinerary } from "../models/itineraries";
const Viewpoint = require("../models/viewpoints");
const Itinerary = require("../models/itineraries");

router.post("/addItinerary", (req: Request, res: Response) => {
  let viewpointsList = req.body.viewpoints_id.split(",");

  Itinerary.findOne({ name: req.body.name }).then((data: IItinerary) => {
    if (!data) {
      const NewItinerary = new Itinerary({
        profile_id: req.body.profile_id,
        viewpoints_id: viewpointsList,
        km: req.body.km,
        map: req.body.map,
        photos: req.body.photos,
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.public,
        isCustom: req.body.custom,
        rating: 0,
        tags: "",
        followers: "",
        isSponsor: false,
        city: req.body.city,
      });

      NewItinerary.save().then((x: any) => {
        Itinerary.findById(x._id)
          .populate("viewpoints_id")
          .then((data: IItinerary) => res.json({ result: true, data }));
      });
    } else {
      res.json({ result: false, error: "itinerary already exists" });
    }
  });
});

router.get("/:city", (req: Request, res: Response) => {
  Itinerary.find({ city: req.params.city, public: true })
    .populate("viewpoints_id")
    .then((data: IItinerary) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "no itinerary" });
      }
    });
});

module.exports = router;
