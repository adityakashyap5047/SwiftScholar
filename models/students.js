const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true,
        unique: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Student",
        required: true
    },
    doubts: [{
        doubt: {
            type: Schema.Types.ObjectId,
            ref: "Doubt",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },
        solution: [{
            image: {
                type: [String],
                validate: {
                    validator: function(arr) {
                        return arr.length <= 7;
                    },
                    message: 'You can upload a maximum of 7 images.'
                },
                required: true
            },
            suggestion: {
                type: String,
                required: true
            },
        }],
        review: [{
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comments: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }]
    }]
});

studentSchema.plugin(passportLocalMongoose);
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;