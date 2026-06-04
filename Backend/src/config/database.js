const mongoose = require("mongoose");

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected.....");
    }
    catch(e){
        console.log("Database does not connect due to : ",e);
    }

}

module.exports = connectToDB;