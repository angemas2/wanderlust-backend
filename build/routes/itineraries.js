"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
require("../models/connection");
const Viewpoint = require("../models/viewpoints");
const Itinerary = require("../models/itineraries");
// create a new itinerary
router.post("/addItinerary", (req, res) => {
    console.log(req.body);
    const ids = req.body.viewpointsList.split(",");
    Itinerary.findOne({ name: req.body.name }).then((data) => {
        if (!data) {
            const NewItinerary = new Itinerary({
                profile_id: req.body.profile_id,
                viewpoints_id: ids,
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
// get itinerary by city
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
//get itineraries created by the user
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
// get itineraries followed by the user
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
// add user as follower when he is following an existing itinerary
router.put("/followers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ItineraryId = yield Itinerary.findById(req.body.id);
    const followers = ItineraryId.followers;
    const userId = req.body.userId;
    Itinerary.findById(req.body.id)
        .populate(["viewpoints_id", "profile_id"])
        .then((data) => {
        var _a;
        if ((_a = data.followers) === null || _a === void 0 ? void 0 : _a.includes(userId)) {
            res.json({
                result: true,
                message: "itinerary already followed",
                data: data,
            });
        }
        else {
            Itinerary.findByIdAndUpdate(req.body.id, {
                followers: [...followers, userId],
            }).then(Itinerary.findById(req.body.id)
                .populate(["viewpoints_id", "profile_id"])
                .then((data) => res.json({ result: true, message: "added", data: data })));
        }
    });
}));
module.exports = router;
