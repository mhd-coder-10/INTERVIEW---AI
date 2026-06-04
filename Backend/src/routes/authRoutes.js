// const express = require("express");
// const authRoutes = express.Router();

const {Router} = require("express");
const authRouter = Router();
const authControllers = require("../controllers/authController");
const authMiddleware  = require("../middelwere/authMiddleware");

/**
 * @route POST/api/auth/register
 * @description register a new user, expects username, email, password in the required
 * @access public
 */
authRouter.post("/register", authControllers.registerUSerController);

/**
 * @route POST/api/auth/login
 * @description Login a User with email and password 
 * @access public
 */
authRouter.post("/login", authControllers.loginUserController);

/**
 * @route GET / api/ auth/logout
 * @description clear token from user cookie and add the in blacklist
 * @access public
 */
authRouter.get("/logout", authControllers.logoutUserController);

/**
 * @route GET/ api/auth/get-me
 * @description get the current loged in user details
 * @access public
 */
authRouter.get("/get-me", authMiddleware.authUser, authControllers.getMeController);

module.exports = authRouter;