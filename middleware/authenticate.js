
module.exports.isSignedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be signed in for this");
        return res.redirect("/study/auth/signin");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isStudent = async (req, res, next) => {
    if(req.isAuthenticated() && req.user.type === "Student") {
        return next();
    }
    req.flash("error", "you must be signed as student for do this");
    return res.redirect("/study");
}

module.exports.isTeacher = async (req, res, next) => {
    if(req.isAuthenticated() && req.user.type === "Teacher"){
        return next();
    }
    req.flash("error", "you must be signed as teacher for do this");
    res.redirect("/study");
}

module.exports.isAdmin = async (req, res, next) => {
    if(req.isAuthenticated() && req.user.type === "Admin"){
        return next();
    }
    req.flash("error", "you must be signed as admin for do this");
    res.redirect("/study");
}

module.exports.isOwnerStudent = async (req, res, next) => {
    const {studentId} = req.params;
    if(req.user && !(String(studentId)===String(req.user._id))){
        req.flash("error", "You don't have permission to do this!");
        return res.redirect("/study");
    }
    next();
}

module.exports.isOwnerTeacher = async(req, res, next) => {
    const {teacherId} = req.params;
    if(req.user && !(String(teacherId)===String(req.user._id))){
        req.flash("error", "You don't have permission to do this!");
        return res.redirect("/study");
    }
    next();
}