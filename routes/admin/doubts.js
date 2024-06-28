const express = require("express");
const Doubt = require("../../models/doubts");
const wrapAsync = require("../../utils/wrapAsync"); 
const {isSignedIn, isAdmin} = require("../../middleware/authenticate.js");
const router = express.Router();

//index route
router.get("/", isSignedIn, isAdmin, wrapAsync(async(req, res) => {
    const allDoubts = await Doubt.find({});
    res.render("admin/doubts/index.ejs", {allDoubts});
}));

//show route
router.get("/:doubtId", isSignedIn, isAdmin, wrapAsync(async(req, res) => {
    let {doubtId} = req.params;
    const doubt = await Doubt.findById(doubtId).populate("student").populate("teacher");
    res.render("admin/doubts/show.ejs", {doubt});
}));

/*********Tasks**********/
//add a route for admin so that he can set the secret code for signup of teachers
/*********Tasks**********/

module.exports = router;