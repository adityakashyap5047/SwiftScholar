const express = require("express");
const Teacher = require("../../models/teachers");
const Student = require("../../models/students");
const wrapAsync = require("../../utils/wrapAsync");
const {isSignedIn, isAdmin} = require("../../middleware/authenticate.js");
const router = express.Router();

// index route
router.get("/", isSignedIn, isAdmin, wrapAsync(async (req, res) => {
    const allTeachers = await Teacher.find({});
    res.render("admin/teachers/index.ejs", {allTeachers});
}));

//show route
router.get("/:teacherId", isSignedIn, isAdmin, wrapAsync(async (req, res) => {
    let {teacherId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const allStudents = await Student.find({});
    const teacherDoubtAssignedDoubt = await Teacher.findById(teacherId).populate("doubtAssigned.doubt");
    // res.send(teacherDoubtAssignedDoubt);
    res.render("admin/teachers/show.ejs", { teacher, teacherDoubtAssignedDoubt, allStudents});
}));

//delete route
router.delete("/:teacherId/delete", isSignedIn, isAdmin, wrapAsync(async(req, res) => {
    let {teacherId} = req.params;
    await Teacher.findByIdAndDelete(teacherId)
    res.redirect("/admin/teachers");
}));

module.exports = router;