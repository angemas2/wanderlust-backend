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
const Activity = require("../models/activities");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");
//add new activity
router.post("/newActivity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let itinerary_id = req.body.itinerary_id;
    let profile_id = req.body.profile_id;
    let type = req.body.type;
    let date = new Date();
    const newActivity = yield new Activity({
        itinerary_id,
        profile_id,
        date,
        photos: [],
        type,
    });
    newActivity.save().then((x) => {
        Activity.findById(x._id)
            .populate(["itinerary_id", "profile_id"])
            .then((data) => res.json({ result: true, data }));
    });
}));
// add pictures to a user existing activity
router.put("/:activityId/addPictures", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = yield req.files.newphoto.mv(photoPath);
    const resultCloudinary = yield cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);
    const activityId = req.params.activityId;
    try {
        const activity = yield Activity.findById(activityId);
        const photos = activity.photos;
        // check that activity exists
        if (!activity) {
            return res.json({ result: false, message: "activity not found" });
        }
        else if (!resultMove) {
            Activity.findByIdAndUpdate(activityId, {
                photos: [...photos, resultCloudinary.secure_url],
            }).then((data) => res.json({ result: true, message: "new picture added", data }));
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ result: false, message: "Failed to add new picture", error });
    }
}));
//get all user activities by type custom or followed
router.get("/:profile_id/:type", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const profile_id = req.params.profile_id;
        const data = yield Activity.find({ profile_id, type }).populate([
            "itinerary_id",
            "profile_id",
        ]);
        res.json({ result: true, data });
    }
    catch (err) {
        console.log(err);
        res.json({ result: false });
    }
}));
//delete pictures
//delete activity
module.exports = router;
