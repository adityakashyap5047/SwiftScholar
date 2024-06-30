const mongoose = require("mongoose");
const initData = require("./teacherData.js");
const Teacher = require("../models/teachers.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/swiftScholar");
};

main()
    .then(()=> {
        console.log("connected to the db");
    })
    .catch((err)=> {
        console.log(err);
    });
    
const initDb = async () => {
    await Teacher.deleteMany({});
    for(data of initData.data){
        const {password, ...otherData} = data;
        const newTeacher = new Teacher(otherData);
        await Teacher.register(newTeacher, password);
    }
    console.log("Teacher data was initializes successfully!!!");
}

initDb();