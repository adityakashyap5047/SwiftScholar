const mongoose = require("mongoose");
const initData = require("./studentData.js");
const Student = require("../models/students.js");

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
    await Student.deleteMany({});
    for(data of initData.data){
        const {password, ...otherData} = data;
        const newStudent = new Student(otherData);
        await Student.register(newStudent, password);
    }
    console.log("Student data was initializes successfully!!!");
}

initDb();