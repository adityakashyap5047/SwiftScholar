const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Student = require("../models/students.js");
const {isSignedIn, isStudent, isOwnerStudent} = require("../middleware/authenticate.js");
const { studentEditedProfileImage } = require("../middleware/imageUpload.js");
const {validateStudent} = require("../middleware/validate.js");

const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    storage: storage
});

//show route
router.get("/:studentId", isSignedIn, isStudent, isOwnerStudent, wrapAsync(async(req, res) => {
    let {studentId} = req.params;
    const student = await Student.findById(studentId);
    const studentDoubts = await Student.findById(studentId).populate("doubts.doubt").populate("doubts.teacher");
    if(!student){
        req.flash("error", "Student you requested for does not exist!");
        res.redirect("/students");
    }
    res.render("students/show.ejs", {student, studentDoubts});
}));

//edit route
router.get("/:studentId/edit", isSignedIn, isStudent, isOwnerStudent, wrapAsync(async(req, res) =>{
    let {studentId} = req.params;
    const student = await Student.findById(studentId);
    res.render("students/edit.ejs", {student});
}));

//update route
router.put("/:studentId",  isSignedIn, isStudent, isOwnerStudent, upload.single("student[profileImage]"), studentEditedProfileImage, validateStudent, wrapAsync(async(req, res) => {
    let {studentId} = req.params;
    try{
        let student = await Student.findByIdAndUpdate(studentId, {...req.body.student});
        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            student.profileImage = url;
            await student.save();
        }
        req.flash("success", "your profile updated successfully!");
        res.redirect(`/students/${studentId}`);
    } catch(e){
        if(e.code === 11000){
            req.flash("error", "Contact number or Email ID already exists");
            return res.redirect(`/students/${studentId}/edit`);
        }
        req.flash("error", e.message);
        return res.redirect(`/students/${studentId}/edit`);
    }
}));

module.exports = router;