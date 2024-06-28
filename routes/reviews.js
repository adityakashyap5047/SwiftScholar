const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Teacher = require("../models/teachers.js");
const Student = require("../models/students.js");
const Doubt = require("../models/doubts.js");
const {isSignedIn, isStudent, isOwnerStudent} = require("../middleware/authenticate.js");
const {validateReview} = require("../middleware/validate.js");

router.post("/", isSignedIn, isStudent, isOwnerStudent, validateReview, wrapAsync(async(req, res) => {
    let {studentId, teacherId, doubtId} = req.params;
    const review = req.body.review;
    const student = await Student.findById(studentId);
    const teacher = await Teacher.findById(teacherId);
    const doubt = await Doubt.findById(doubtId);

    doubt.review.push(review);
    await doubt.save();

    for(let dbt of student.doubts){
        if(dbt.doubt._id == doubtId){
            dbt.review.push(review);
        } 
    }
    await student.save();

    for(let dbtAsgn of teacher.doubtAssigned){
        if(dbtAsgn.doubt._id == doubtId){
            dbtAsgn.review.push(review);
        }
    }
    await teacher.save();

    res.redirect(`/students/${studentId}`);
}));

module.exports = router;