const express = require("express");
const Student = require("../../models/students");
const wrapAsync = require("../../utils/wrapAsync");
const {isSignedIn, isAdmin} = require("../../middleware/authenticate.js");
const router = express.Router();

//index route
router.get("/", isSignedIn, isAdmin, wrapAsync(async (req, res) => {
    const allStudents = await Student.find({});
    res.render("admin/students/index.ejs", {allStudents});
}));

//show route
router.get("/:studentId", isSignedIn, isAdmin, wrapAsync(async (req, res) => {
    let {studentId} = req.params;
    const student = await Student.findById(studentId);
    const studentDoubts = await Student.findById(studentId).populate("doubts.doubt").populate("doubts.teacher");
    if(!student){
        req.flash("error", "Student you requested for does not exist!");
        res.redirect("/students");
    }
    res.render("admin/students/show.ejs", {student, studentDoubts});
}));


// router.get("/:studentId/delete", wrapAsync(async(req, res) => {
//     res.send("hello g");
// }));

//delete route
router.delete("/:studentId/delete", isSignedIn, isAdmin, wrapAsync(async(req, res) => {
    let {studentId} = req.params;
    await Student.findByIdAndDelete(studentId);
    res.redirect("/admin/students");
}));

module.exports = router;