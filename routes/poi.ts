var express = require("express");
var router = express.Router();
require("../models/connection");
import { Request, Response } from "express";
import { IPoi } from "../models/poi";
const Poi = require("../models/poi");

router.post("/addPoi", (req: Request, res: Response) => {
  Poi.findOne({ name: req.body.name }).then((data: IPoi) => {
    if (data === null) {
      const newPoi = new Poi({
        profile_id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        photos: "",
        location: req.body.location,
        tags_id: "",
      });

      newPoi.save().then((data: IPoi) => {
        res.json({ result: true, data: data });
      });
    } else {
      res.json({ result: false, error: "poi already exists" });
    }
  });
});

module.exports = router;
