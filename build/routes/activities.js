"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
require('../models/connection');
const Activity = require('../models/activities');
router.get('/', (req, res) => {
    Activity.find({ city: req.params.city })
        .populate('itineraries_id')
        .then((data) => {
        data
            ? res.json({ result: true, data: data })
            : res.json({ result: false, error: 'no itinerary' });
    });
});
module.exports = router;
