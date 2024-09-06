const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signUp
router.get("/signup", userController.renderSignUpForm);

router.post("/signup", userController.signup);

//login
router.get("/login", userController.renderLoginForm);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout
router.get("/logout", userController.logout);
module.exports = router;
