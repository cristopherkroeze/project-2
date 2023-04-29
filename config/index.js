var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get("/", (req,res) => {
    res.render("index.hbs");
})


router.get("/shows", (req,res) => {
   let shows = [];
   res.render("shows.hbs", {shows});
})

router.get("/anime-entry", isLoggedIn, (req, res) => {
    res.render("anime-entry.hbs");
})

router.post("anime-entry", (req, res) => {
    const { name, genre, rating ,synopsis, image} = req.body;

    if (!name || !genre || !rating || !synopsis || !image) {
        res.render('anime-entry', { errorMessage: 'All fields are mandatory. Please try again' });
        return;
      }
})


module.exports = router;