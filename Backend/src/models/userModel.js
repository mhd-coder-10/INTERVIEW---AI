const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true, "Username allready Taken."],
        required : true
    },
    email : {
        type : String,
        unique : [true, "This Email allready Taken."],
        required : true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps : true});

const userModel= new mongoose.model("users", UserSchema);
module.exports = userModel;