const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const userController = require("../controllers/user");
// login
router.get("/login", userController.renderLogin);
// login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.logIn
);

// signup
router.get("/signup", userController.renderSignUp);

// post signup
router.post("/signup",userController.signUp );

//logout
router.get("/logout", userController.logOut);

module.exports = router;
