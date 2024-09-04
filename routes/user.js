const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

//signUp
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

//login
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust! You are logged in!");
    res.redirect("/listings");
  }
);

//logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
});
module.exports = router;
