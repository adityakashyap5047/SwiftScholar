const ExpressError = require("../utils/ExpressError.js");
const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const util = require("util");
const upload = multer({
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    storage: storage
});

module.exports.doubtImage = (req, res, next) => {
    if(!req.files){
        throw new ExpressError(400, "Please, Upload the Image");
    }
    const files = req.files;
    const url = files.map(file => file.path);
    req.body.doubt.image = url;
    next();
}

module.exports.solutionImage = (req, res, next) => {
    if(!req.files){
        throw new ExpressError(400, "Please, Upload the Image");
    }
    const files = req.files;
    const url = files.map(file => file.path);
    req.body.solution.image = url;
    next();
}

studentProfileImage = (req, res, next) => {
    if(!req.files){
        throw new ExpressError(400, "Please, Upload the Image");
    }
    req.body.student.profileImage = req.files[0].path;
    next();
}

teacherProfileImage = (req, res, next) => {
    if(!req.files){
        throw new ExpressError(400, "Please, Upload the Image");
    }
    req.body.teacher.profileImage = req.files[0].path;
    next();
}

adminProfileImage = (req, res, next) => {
    if(!req.files){
        throw new ExpressError(400, "Please, Upload the Image");
    }
    req.body.admin.profileImage = req.files[0].path;
    next();
}

module.exports.handleProfileImage = async (req, res, next) => {
    const uploadMiddleware = upload.any();

    try {
        await util.promisify(uploadMiddleware)(req, res);
        let profileMiddleware;
        if (req.files && req.files.length > 0) {
            const fieldName = req.files[0].fieldname;

            if (fieldName.startsWith("student[")) {
                profileMiddleware = util.promisify(studentProfileImage);
            } else if (fieldName.startsWith("teacher[")) {
                profileMiddleware = util.promisify(teacherProfileImage);
            } else if (fieldName.startsWith("admin[")) {
                profileMiddleware = util.promisify(adminProfileImage);
            }
        }

        if (profileMiddleware) {
            await profileMiddleware(req, res);
        }

        next();
    } catch (err) {
        next(err);
    }
};