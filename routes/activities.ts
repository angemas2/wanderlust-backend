var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IActivity } from "../models/activities";

const Activity = require("../models/activities");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dp6ldy3ti",
  api_key: "727571472679694",
  api_secret: "P9z_J77Uud4WaGy_5nI4shAR67k",
});

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

  try {
    const activity = await Activity.findById(activityId);
    const photos = activity.photos;

    const imageData: any = [];

    req.on("data", (data: any) => {
      imageData.push(data);
    });

    req.on("end", () => {
      const imageBuffer = Buffer.concat(imageData);

      cloudinary.uploader
        .upload_stream(
          { resource_type: "image" },
          async (error: any, result: any) => {
            if (error) {
              console.error(error);
              res.status(500).send(error);
            } else {
              console.log(result);

              const updateActivity = await Activity.findByIdAndUpdate(
                activityId,
                {
                  photos: [...photos, result.secure_url],
                },
                { new: true }
              );
              res.json({ result: true, data: updateActivity });
            }
          }
        )
        .end(imageBuffer);
    });
  } catch (error) {
    res.json({ result: false, error });
  }
});

//get all user activities by type custom or followed
router.get("/:profile_id/:type", async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    const profile_id = req.params.profile_id;

    const data = await Activity.find({ profile_id, type }).populate([
      { path: "itinerary_id", populate: { path: "viewpoints_id" } },
      "profile_id",
    ]);

    res.json({ result: true, data });
  } catch (err) {
    console.log(err);
    res.json({ result: false });
  }
});

//delete pictures
router.delete("/deleteactivity", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await Activity.findByIdAndDelete(id);
    const found = await Activity.findById(id);
    if (found) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ result: false, error: "activity not found" });
  }
});

module.exports = router;
