"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
require("../models/connection");
const Viewpoint = require("../models/viewpoints");
const Itinerary = require("../models/itineraries");
router.post("/addItinerary", (req, res) => {
    console.log(req.body);
    Itinerary.findOne({ name: req.body.name }).then((data) => {
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
            NewItinerary.save().then((x) => {
                Itinerary.findById(x._id)
                    .populate(["viewpoints_id", "profile_id"])
                    .then((data) => res.json({ result: true, data }));
            });
        }
        else {
            res.json({ result: false, error: "itinerary already exists" });
        }
    });
});
router.get("/:city", (req, res) => {
    Itinerary.find({
        city: { $regex: new RegExp(req.params.city, "i") },
        public: true,
    })
        .populate(["viewpoints_id", "profile_id"])
        .then((data) => {
        if (data) {
            res.json({ result: true, data: data });
        }
        else {
            res.json({ result: false, error: "no itinerary" });
        }
    });
});
router.get("/profile/:profile", (req, res) => {
    Itinerary.find({ profile_id: req.params.profile })
        .populate(["viewpoints_id", "profile_id"])
        .then((data) => {
        if (data) {
            res.json({ result: true, data: data });
        }
        else {
            res.json({ result: false, error: "no itinerary for this profile" });
        }
    });
});
router.get("/followed/:profile", (req, res) => {
    Itinerary.find()
        .populate("viewpoints_id")
        .then((data) => {
        if (data) {
            let newdata = data.filter((e) => e.followers.includes(req.params.profile));
            res.json({ result: true, data: newdata });
        }
        else {
            res.json({ result: false, error: "no itinerary found" });
        }
    });
});
module.exports = router;
