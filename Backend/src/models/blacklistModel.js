const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "Token is required to be added in Blacklist"]
    }
})

const blackListToken = new mongoose.model("BlacklistToken", blacklistTokenSchema);

module.exports = blackListToken