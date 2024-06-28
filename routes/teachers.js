const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Teacher = require("../models/teachers.js");
const {isSignedIn, isTeacher, isOwnerTeacher} = require("../middleware/authenticate.js");
const {validateTeacher} = require("../middleware/validate.js");

//index route
router.get("/", isSignedIn, wrapAsync(async(req, res) => {
    const allTeachers = await Teacher.find({});
    res.render("teachers/index.ejs", {allTeachers});
}));

//show route
router.get("/:teacherId", isSignedIn, isTeacher, isOwnerTeacher, wrapAsync(async(req, res) => {
    let {teacherId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const teacherDoubtAssigned = await Teacher.findById(teacherId).populate("doubtAssigned.student").populate("doubtAssigned.doubt").populate("doubtAssigned.solution");
    res.render("teachers/show.ejs", { teacher, teacherDoubtAssigned});
}));
  
//edit route
router.get("/:teacherId/edit", isSignedIn, isTeacher, isOwnerTeacher, wrapAsync(async(req, res) => {
    let {teacherId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    res.render("teachers/edit.ejs", {teacher});
}));

//update route
router.put("/:teacherId", isSignedIn, isTeacher, isOwnerTeacher, validateTeacher, wrapAsync(async(req, res) => {
    let {teacherId} = req.params;
    try{
        await Teacher.findByIdAndUpdate(teacherId, {...req.body.teacher});
        req.flash("success", "your profile updated successfully!");
        res.redirect(`/teachers/${teacherId}`);
    } catch(e){
        if(e.code === 11000){
            req.flash("error", "Contact number or Email ID already exists");
            return res.redirect(`/teachers/${teacherId}/edit`);
        }
        req.flash("error", e.message);
        return res.redirect(`/teachers/${teacherId}/edit`);
    }
}));

//delete route
router.delete("/:teacherId/delete", isSignedIn, isTeacher, isOwnerTeacher, wrapAsync(async(req, res) => {
    let {teacherId} = req.params;
    await Teacher.findByIdAndDelete(teacherId);
    req.flash("success", "your profile deleted successfully!");
    res.redirect("/study");
}));

module.exports = router;