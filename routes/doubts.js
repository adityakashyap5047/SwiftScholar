const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Teacher = require("../models/teachers.js");
const Student = require("../models/students.js");
const Doubt = require("../models/doubts.js");
const {isSignedIn, isStudent, isTeacher, isOwnerStudent, isOwnerTeacher} = require("../middleware/authenticate.js");
const {solutionImage, doubtImage} = require("../middleware/imageUpload.js");
const {validateDoubt, validateSolution } = require("../middleware/validate.js");

const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({
    limits: {
        fileSize: 2 * 1024 * 1024
    }, 
    storage: storage 
});

//create route
//create doubt by student
router.get("/doubt", isSignedIn, isStudent, isOwnerStudent, async (req, res) => {
    const allTeachers = await Teacher.find({});
    let {studentId} = req.params;
    res.render("doubts/new.ejs", {studentId, allTeachers});
});

// create doubt by student - post
router.post("/doubt", isSignedIn, isStudent, isOwnerStudent, upload.array('doubt[image]', 7), doubtImage, validateDoubt, wrapAsync(async (req, res) => {
    const files = req.files;
    const urls = files.map(file => file.path);
    const newDoubt = new Doubt(req.body.doubt);
    newDoubt.image = urls;
    let {studentId} = req.params;
    let teacherId = req.body.doubt.teacher;
    if(teacherId === "none"){
        throw new ExpressError(400, "Please, Select the Teacher");
    }
    const student = await Student.findById(studentId);
    const teacher = await Teacher.findById(teacherId);
    student.doubts.push({
        doubt: newDoubt,
        teacher: teacher
    });

    teacher.doubtAssigned.push({
        student: student,
        doubt: newDoubt
    });
 
    await newDoubt.save();
    await student.save();
    await teacher.save();
    res.redirect(`/students/${studentId}`);
}));

//show route for the doubts --- student
router.get("/:doubtId/:teacherId/doubt", isSignedIn, isStudent, isOwnerStudent, wrapAsync(async(req, res) => {
    let {studentId, teacherId, doubtId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const doubt = await Doubt.findById(doubtId);
    res.render("doubts/show.ejs", {teacher, doubt, studentId, teacherId, doubtId});
}));

//solution route for the doubts --- teacher
router.get("/:doubtId/:teacherId/solution/teachers", isSignedIn, isTeacher, wrapAsync(async(req, res) => {
    let {teacherId, studentId, doubtId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const doubt = await Doubt.findById(doubtId);
    res.render("doubts/teacher.ejs", {teacherId, studentId, doubtId, doubt, teacher});
}));

//show of the doubt - by teacher
router.get("/:doubtId/:teacherId/solution", isSignedIn, isTeacher, isOwnerTeacher, wrapAsync(async (req, res) => {
    let {teacherId, studentId, doubtId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const doubt = await Doubt.findById(doubtId);
    res.render("doubts/solution.ejs", {teacherId, studentId, doubtId, doubt, teacher});
}));

//solution of the doubt - by teacher
router.post("/:doubtId/:teacherId/solution", isSignedIn, isTeacher, isOwnerTeacher, upload.array('solution[image]', 7), solutionImage, validateSolution, wrapAsync(async (req, res) => {
    let {teacherId, studentId, doubtId} = req.params;
    const teacher = await Teacher.findById(teacherId);
    const student = await Student.findById(studentId);
    const doubt = await Doubt.findById(doubtId); 
    const solution = req.body.solution;

    const files = req.files;
    const urls = files.map(file => file.path);
    solution.image = urls;

    doubt.solution.push(solution);
    await doubt.save();
    
    for(let dbt of student.doubts){
        if(dbt.doubt._id == doubtId){
            dbt.solution.push(solution);
        }
    }
    await student.save();

    for(let dbtAsgn of teacher.doubtAssigned){
        if(dbtAsgn.doubt._id == doubtId){
            dbtAsgn.solution.push(solution);
        }
    }
    await teacher.save();

    res.redirect(`/teachers/${teacherId}`);
}));

module.exports = router;