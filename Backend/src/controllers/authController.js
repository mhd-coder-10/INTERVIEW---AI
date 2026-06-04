const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListToken = require("../models/blacklistModel");

/**
 * @route registerUserController
 * @description register a new user, expects username, email, password in the request body
 * @access public
 */

async function registerUSerController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide a usrname, Email and Password"
            });
        }

        const isUserExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserExist) {
            return res.status(400).json({
                message: `Account all ready exists with this ${username} or ${email}`
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        //  Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // Set to true if using HTTPS ,( true for production and false for development) 
            sameSite: "lax"
        });

        return res.status(201).json({
            message: "User Registerd Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error : " + err.message
        })
    }

}

/**
 * @route loginUserController
 * @decription login a user, expects username, email, password in the request body
 * @access public
 */

async function loginUserController(req, res) {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: `Invalid Email or Password`
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly : true,
            secure : false,
            sameSite : "lax" 
        });

        return res.status(201).json({
            message: "User LoggedIn Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error : " + err.message
        })
    }
}

/**
 * @route logoutUserController
 * @description logout a user by clening the cookie
 * @access public
 */

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if(token) {
            await blackListToken.create({ token });
        }
        res.clearCookie("token");

        return res.status(200).json({
            message: "Logged Out Sucessfully"
        })
    } catch (err) {
        return res.status(500).json({
            message : "Internal Server Error : " + err.message
        })
    }
}

/**
 * @name getMeController
 * @description get the current user details
 * @access public
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        return res.status(200).json({
            message : " User Details fetched successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
    } catch(err){
        return res.status(500).json({
            message : "Internal Server Error : " + err.message
        })
    }
}

module.exports = {
    registerUSerController,
    loginUserController,
    logoutUserController,
    getMeController
};