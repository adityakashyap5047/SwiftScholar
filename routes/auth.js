const express = require("express");
const { saveRedirectUrl } = require("../middleware/authenticate.js");
const {validateStudent, validateTeacher, validateAdmin} = require("../middleware/validate");
const {handleProfileImage} = require("../middleware/imageUpload.js");
const Student = require("../models/students");
const Teacher = require("../models/teachers");
const Admin = require("../models/admin");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();


//signup route
router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
});

router.post("/signup", handleProfileImage, wrapAsync(async(req, res, next) => {
    const {role} = req.body; 
    if (role === "student") {
        const {student, password} = req.body;
        delete req.body.teacher;
        delete req.body.admin;
        delete req.body.passkey;
        validateStudent(req, res, wrapAsync(async (err) => {
            if (err) return next(err); 
            try {
                const newStudent = new Student(student);
                newStudent.profileImage = req.files[0].path;
                const registeredStudent = await Student.register(newStudent, password);
                req.login(registeredStudent, (err) => {
                    if(err){
                        return next(err);
                    }
                    req.flash("success", "You successfully signed in as a student");
                    res.redirect("/study");
                });
            } catch (e) {
                if(e.code === 11000){
                    req.flash("error", "Contact number or Email ID already exists");
                    return res.redirect("/study/auth/signup");
                }
                req.flash("error", e.message);
                return res.redirect("/study/auth/signup");
            } 
        }));
    } else if (role === "teacher") {
        const {teacher, passkey, password} = req.body;
        delete req.body.student;
        delete req.body.admin; 
        if(!(passkey == process.env.TEACHER_SIGNUP_SECRET)){
            req.flash("error", "you don't have the permission to do this");
            return res.redirect("/study");
        }
        validateTeacher(req, res, wrapAsync(async (err) => {
            if (err) return next(err);
            try {
                const newTeacher = new Teacher(teacher);
                newTeacher.profileImage = req.files[0].path;
                const registeredTeacher = await Teacher.register(newTeacher, password);
                req.login(registeredTeacher, (err) => {
                    if(err){
                        return next(err);
                    }
                    req.flash("success", "You successfully signed in as a teacher");
                    res.redirect("/study");
                });
            } catch (e) {
                if(e.code === 11000){
                    req.flash("error", "Contact number or Email ID already exists");
                    return res.redirect("/study/auth/signup");
                }
                req.flash("error", e.message);
                return res.redirect("/study/auth/signup");
            }
        }));
    } else if(role === "admin") {
        const {admin, password} = req.body;
        delete req.body.student;
        delete req.body.teacher;
        if(!(admin.passkey == process.env.ADMIN_PASSKEY && admin.securityCode == process.env.ADMIN_SECURITY_CODE)){
            req.flash("error", "you don't have the permission to do this");
            return res.redirect("/study");
        }
        validateAdmin(req, res, wrapAsync(async(err) => {
            if (err) return next(err);
            try{
                const newAdmin = new Admin(admin);
                newAdmin.profileImage = req.files[0].path;
                const registeredAdmin = await Admin.register(newAdmin, password);
                req.login(registeredAdmin, (err) => {
                    if(err){
                        return next(err);
                    }
                    req.flash("success", "You successfully signed in as an Admin");
                    res.redirect("/study");
                });
            } catch (e) {
                if(e.code === 11000){
                    req.flash("error", "Contact number or Email ID already exists");
                    return res.redirect("/study/auth/signup");
                }
                req.flash("error", e.message);
                return res.redirect("/study/auth/signup");
            }
        }));
    } else {
        next(new ExpressError(400, "Please enter a valid request"));
    }
}));

//signin route
router.get("/signin", (req, res) => {
    res.render("auth/signin.ejs");
});

router.post("/signin", saveRedirectUrl, (req, res, next) => {
    const { role } = req.body;
    if (role === "student") {
        delete req.body.passkey;
        delete req.body.securityCode;
        passport.authenticate("student-local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash("error", info.message || "Invalid credentials");
                return res.redirect("/study/auth/signin");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "You successfully signed in as student");
                let redirectUrl = res.locals.redirectUrl || "/study";
                return res.redirect(redirectUrl);
            });
        })(req, res, next);
    } else if (role === "teacher") {
        delete req.body.passkey;
        delete req.body.securityCode;
        passport.authenticate("teacher-local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash("error", info.message || "Invalid credentials");
                return res.redirect("/study/auth/signin");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "You successfully signed in as teacher");
                let redirectUrl = res.locals.redirectUrl || "/study";
                return res.redirect(redirectUrl);
            });
        })(req, res, next);
    } else if (role === "admin") {
        const {passkey, securityCode} = req.body;
        if(!(passkey == process.env.ADMIN_PASSKEY && securityCode == process.env.ADMIN_SECURITY_CODE)){
            req.flash("error", "Passkey or securityCode is incorrect");
            return res.redirect("/study/auth/signin");
        }
        passport.authenticate("admin-local", (err, user, info) => {
            if(err) {
                return next(err);
            }
            if(!user){
                req.flash("error", info.message || "Invalid credentials");
                return res.redirect("/study/auth/signin");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "You successfully signed in as admin");
                let redirectUrl = res.locals.redirectUrl || "/study";
                return res.redirect(redirectUrl);
            });
        })(req, res, next);
    } else {
        next(new ExpressError(400, "Please enter a valid request"));
    }
});

//signout route
router.get("/signout", (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are signed out now");
        res.redirect("/study");
    });
});

module.exports = router;