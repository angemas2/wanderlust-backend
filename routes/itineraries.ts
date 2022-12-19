var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IPoi } from "../models/viewpoints";
import { IItinerary } from "../models/itineraries";
const Viewpoint = require("../models/viewpoints");
const Itinerary = require("../models/itineraries");

// create a new itinerary

router.post("/addItinerary", (req: Request, res: Response) => {
  console.log(req.body);


  Itinerary.findOne({ name: req.body.name }).then((data: IItinerary) => {
    if (!data) {
      const NewItinerary = new Itinerary({
        profile_id: req.body.profile_id,
        viewpoints_id: req.body.viewpointsList,
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
          .populate(["viewpoints_id", "profile_id"])
          .then((data: IItinerary) => res.json({ result: true, data }));
      });
    } else {
      res.json({ result: false, error: "itinerary already exists" });
    }
  });
});

// get itinerary by city

router.get("/:city", (req: Request, res: Response) => {
  Itinerary.find({
    city: { $regex: new RegExp(req.params.city, "i") },
    public: true,
  })
    .populate(["viewpoints_id", "profile_id"])
    .then((data: IItinerary) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "no itinerary" });
      }
    });
});

//get itineraries created by the user

router.get("/profile/:profile", (req: Request, res: Response) => {
  Itinerary.find({ profile_id: req.params.profile })
    .populate(["viewpoints_id", "profile_id"])
    .then((data: IItinerary) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "no itinerary for this profile" });
      }
    });
});

// get itineraries followed by the user

router.get("/followed/:profile", (req: Request, res: Response) => {
  Itinerary.find()
    .populate("viewpoints_id")
    .then((data: IItinerary[]) => {
      if (data) {
        let newdata = data.filter((e: any) =>
          e.followers.includes(req.params.profile)
        );
        res.json({ result: true, data: newdata });
      } else {
        res.json({ result: false, error: "no itinerary found" });
      }
    });
});

// add user as follower when he is following an existing itinerary

router.put("/followers", async (req: Request, res: Response) => {
  const ItineraryId = await Itinerary.findById(req.body.id);

  const followers = ItineraryId.followers;
  const userId = req.body.userId;

  Itinerary.findById(req.body.id)
    .populate(["viewpoints_id", "profile_id"])
    .then((data: IItinerary) => {
      if (data.followers?.includes(userId)) {
        res.json({
          result: true,
          message: "itinerary already followed",
          data: data,
        });
      } else {
        Itinerary.findByIdAndUpdate(req.body.id, {
          followers: [...followers, userId],
        }).then(
          Itinerary.findById(req.body.id)
            .populate(["viewpoints_id", "profile_id"])
            .then((data: IItinerary) =>
              res.json({ result: true, message: "added", data: data })
            )
        );
      }
    });
});

module.exports = router;
