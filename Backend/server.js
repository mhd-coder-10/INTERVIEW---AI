require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
connectToDB();
const port = 3000;

app.listen(port, ()=>{
    console.log(`Server in running on port ${port}`);
});