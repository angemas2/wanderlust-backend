"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
require('../models/connection');
const Viewpoint = require('../models/viewpoints');
router.post('/addPoint', (req, res) => {
    Viewpoint.findOne({ location: req.body.location }).then((data) => {
        if (!data) {
            const NewViewpoint = new Viewpoint({
                name: req.body.name,
                description: req.body.description,
                photos: req.body.photos,
                location: req.body.location,
                tags_id: req.body.tags_id,
            });
            NewViewpoint.save().then((data) => {
                res.json({ result: true, data: data });
            });
        }
        else {
            res.json({
                result: true,
                message: 'viewpoint already exists',
                data: data,
            });
        }
    });
});
router.get('/:name', (req, res) => {
    Viewpoint.findOne({ name: req.params.name }).then((data) => {
        data === null
            ? res.json({ result: false, error: 'point not found' })
            : res.json({ result: true });
    });
});
router.get('/', (req, res) => {
    Viewpoint.find({ name: req.params.name }).then((data) => {
        //check if there is data
        data ? res.json({ result: false, error: 'no data' }) : res.json({ result: data });
    });
});
module.exports = router;
