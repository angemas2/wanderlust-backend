var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IActivity } from "../models/activities";

const Activity = require("../models/activities");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uniqid = require("uniqid");

//add new activity
router.post("/newActivity", async (req: Request, res: Response) => {
  let itinerary_id = req.body.itinerary_id;
  let profile_id = req.body.profile_id;
  let type = req.body.type;
  let date = new Date();

  const newActivity = await new Activity({
    itinerary_id,
    profile_id,
    date,
    photos: [],
    type,
  });

  newActivity.save().then((x: any) => {
    Activity.findById(x._id)
      .populate(["itinerary_id", "profile_id"])
      .then((data: IActivity) => res.json({ result: true, data }));
  });
});

// add pictures to a user existing activity
router.put("/:activityId/addPictures", async (req: any, res: Response) => {
  const activityId = req.params.activityId;
  const buffer = req.body.buffer;

  try {
    const activity = await Activity.findById(activityId);
    const photos = activity.photos;
    // check that activity exists
    if (!activity) {
      return res.json({ result: false, message: "activity not found" });
    } else {
      const result = await cloudinary.uploader.upload(buffer, {
        resource_type: "raw",
      });
      Activity.findByIdAndUpdate(activityId, {
        photos: [...photos, result.secure_url],
      }).then((data: IActivity) =>
        res.json({ result: true, message: "new picture added", data })
      );
    }
  } catch (error) {
    res
      .status(500)
      .json({ result: false, message: "Failed to add new picture", error });
  }
});

//get all user activities by type custom or followed
router.get("/:profile_id/:type", async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    const profile_id = req.params.profile_id;

    const data = await Activity.find({ profile_id, type }).populate([
      "itinerary_id",
      "profile_id",
    ]);

    res.json({ result: true, data });
  } catch (err) {
    console.log(err);
    res.json({ result: false });
  }
});

//delete pictures

//delete activity

module.exports = router;
