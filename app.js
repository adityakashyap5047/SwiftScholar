if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dbUrl = "mongodb://127.0.0.1:27017/swiftScholar";
async function main(){
    await mongoose.connect(dbUrl);
};

main()
    .then(()=> { 
        console.log("connected to the db");
    })
    .catch((err)=> {
        console.log(err); 
    });


const port = process.env.PORT || 8080;

const path = require("path");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));


const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const students = require("./routes/students.js");
const teachers = require("./routes/teachers.js");
const doubts = require("./routes/doubts.js");
const reviews = require("./routes/reviews.js");
const auth = require("./routes/auth.js");
const adminStudent = require("./routes/admin/students.js");
const adminTeacher = require("./routes/admin/teachers.js");
const adminDoubt = require("./routes/admin/doubts.js");

const session = require("express-session");
const flash = require("connect-flash");

const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const Student = require("./models/students.js");
const Teacher = require("./models/teachers.js");
const Admin = require("./models/admin.js");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    }, 
    touchAfter: 24 * 60 * 60
}); 

store.on("error", function(e){  
    console.log("Session store error", e);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}       

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use("student-local", new LocalStrategy(Student.authenticate()));
passport.use("teacher-local", new LocalStrategy(Teacher.authenticate()));
passport.use("admin-local", new LocalStrategy(Admin.authenticate()));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, type: user.type });
});

passport.deserializeUser(async (obj, done) => {
    try{
        let user;
        if(obj.type === "Student"){
            user = await Student.findById(obj.id);
        }
        else if(obj.type === "Teacher"){
            user = await Teacher.findById(obj.id);
        }
        else if(obj.type === "Admin"){
            user = await Admin.findById(obj.id);
        }        
        else{
            return done(new ExpressError(400, `User type ${obj.type} not recognized!`));
        }
        done(null, user);
    }
    catch(err){
        done(err);
    }
});

app.use(wrapAsync(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.allTeachers = await Teacher.find({});
    if(req.user && req.user.type === "Student"){
        res.locals.studentDoubt = await Student.findById(req.user._id).populate("doubts.doubt").populate("doubts.teacher");
    } else if(req.user && req.user.type === "Teacher"){
        res.locals.teacherDoubtsAssigned = await Teacher.findById(req.user._id).populate("doubtAssigned.student").populate("doubtAssigned.doubt").populate("doubtAssigned.solution");
    }
    next(); 
}));


app.listen(port, () => { 
    console.log(`app is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.redirect("/study");
});

//authentication
app.use("/study/auth", auth);

//Teachers  resource: teachers
app.use("/teachers", teachers);

//Students resource: students
app.use("/students", students);

//Doubts resource: doubts
app.use("/doubts/:studentId", doubts);

//review resource:- reviews
app.use("/reviews/:studentId/:teacherId/:doubtId", reviews);


//admin route student
app.use("/admin/students", adminStudent);

//admin route teacher
app.use("/admin/teachers", adminTeacher);

//admin route doubt
app.use("/admin/doubts", adminDoubt);

//admin route
app.get("/admin/:adminId", async (req, res) => {
    const {adminId} = req.params;
    req.flash("success", "on process");
    return res.send("/study")
});


/*****************Backend Development********************/
//make application so that the admin can set the passkey and securityCode
/*****************Backend Development********************/

//Home page resource: study
//home route
app.get("/study", (req, res) => {
    res.render("study/index.ejs");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!")); 
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});