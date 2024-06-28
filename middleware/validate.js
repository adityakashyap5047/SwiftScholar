const ExpressError = require("../utils/ExpressError.js");
const {studentSchema} = require("../schema/student.js");
const {teacherSchema} = require("../schema/teacher.js");
const {reviewSchema} = require("../schema/review.js");
const {doubtSchema} = require("../schema/doubt.js");
const {solutionSchema} = require("../schema/solution.js");
const {adminSchema} = require("../schema/admin.js");


module.exports.validateStudent = (req, res, next) => {
    let {error} = studentSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateTeacher = (req, res, next) => {
    let {error} = teacherSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateAdmin = (req, res, next) => {
    let {error} = adminSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateDoubt = (req, res, next) => {
    let {error} = doubtSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateSolution = (req, res, next) => {
    let {error} = solutionSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}