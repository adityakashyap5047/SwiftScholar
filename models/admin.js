const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
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
    passkey: {
        type: String,
        required: true
    },
    securityCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Admin",
        required: true
    }
});

adminSchema.plugin(passportLocalMongoose);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;