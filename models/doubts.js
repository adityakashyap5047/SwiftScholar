const { required } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;

const doubtSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    class: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
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
});

const Doubt = mongoose.model("Doubt", doubtSchema);
module.exports = Doubt;