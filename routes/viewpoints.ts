var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IPoi } from "../models/viewpoints";
const Viewpoint = require("../models/viewpoints");

router.post("/addPoint", (req: Request, res: Response) => {
  Viewpoint.findOne({ location: req.body.location }).then((data: IPoi) => {
    if (!data) {
      const NewViewpoint = new Viewpoint({
        name: req.body.name,
        description: req.body.description,
        photos: req.body.photos,
        location: req.body.location,
        tags_id: req.body.tags_id,
      });

      NewViewpoint.save().then((data: IPoi) => {
        res.json({ result: true, data: data });
      });
    } else {
      res.json({
        result: true,
        message: "viewpoint already exists",
        data: data,
      });
    }
  });
});

router.get("/:name", (req: Request, res: Response) => {
  Viewpoint.findOne({ name: req.params.name }).then((data: IPoi) => {
    if (data === null) {
      res.json({ result: false, error: "point not found" });
    } else {
      res.json({ result: true });
    }
  });
});

router.get("/", (req: Request, res: Response) => {
  Viewpoint.find({ name: req.params.name }).then((data: IPoi) => {
    //check if there is data
    if (data) {
      res.json({ result: false, error: "no data" });
    } else {
      res.json({ result: data });
    }
  });
});

module.exports = router;
