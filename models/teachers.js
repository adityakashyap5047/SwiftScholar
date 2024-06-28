const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
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
        default: "Teacher",
        required: true
    },
    doubtAssigned: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        doubt: {
            type: Schema.Types.ObjectId,
            ref: "Doubt",
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

teacherSchema.plugin(passportLocalMongoose);
const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;