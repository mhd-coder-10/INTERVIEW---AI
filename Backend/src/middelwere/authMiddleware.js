const jwt = require("jsonwebtoken");
const tokenBlackListedModel = require("../models/blacklistModel");

async function authUser(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    
    if (!token) {
        return res.status(401).json({
            message: "Token Not Provided"
        })
    }

    const isTokenBlackListed = await tokenBlackListedModel.findOne({ token });
    if (isTokenBlackListed) {
        return res.status(401).json({
            message: "Token is Invalid"
        })
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = { authUser }