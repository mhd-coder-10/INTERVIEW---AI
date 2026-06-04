const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173" || "http://localhost:5174",
    credentials : true
}));


// Require all the routes here
const authRouter = require("./routes/authRoutes");
const interviewRouter = require("./routes/interviewRoutes");

// Using all routes here
app.use("/api/auth/", authRouter);
app.use("/api/interview/", interviewRouter);

module.exports = app;